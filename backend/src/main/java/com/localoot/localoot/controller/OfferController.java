package com.localoot.localoot.controller;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.localoot.localoot.model.AdminSettings;
import com.localoot.localoot.model.Offer;
import com.localoot.localoot.model.OfferHistory;
import com.localoot.localoot.model.Subscription;
import com.localoot.localoot.model.User;
import com.localoot.localoot.repository.AdminSettingsRepository;
import com.localoot.localoot.repository.OfferHistoryRepository;
import com.localoot.localoot.repository.OfferRepository;
import com.localoot.localoot.repository.SubscriptionRepository;
import com.localoot.localoot.repository.UserRepository;
import com.localoot.localoot.service.NotificationService;

@RestController
@RequestMapping("/api/offers")
// This allows your React app (running on port 5173) to talk to this backend
@CrossOrigin(origins = "http://localhost:5173")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private AdminSettingsRepository settingsRepository;

    @Autowired
    private OfferHistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private boolean isOfferActive(Offer offer) {
        if (offer == null || !"APPROVED".equalsIgnoreCase(offer.getStatus())) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        if (offer.getValidFrom() != null && now.isBefore(offer.getValidFrom())) {
            return false;
        }

        if (offer.getValidUntil() != null && now.isAfter(offer.getValidUntil())) {
            return false;
        }

        return true;
    }

    private void expireOffers() {
        LocalDateTime now = LocalDateTime.now();
        List<Offer> expiring = offerRepository.findByStatus("APPROVED").stream()
                .filter(o -> o.getValidUntil() != null && now.isAfter(o.getValidUntil()))
                .collect(Collectors.toList());

        if (!expiring.isEmpty()) {
            expiring.forEach(o -> o.setStatus("EXPIRED"));
            offerRepository.saveAll(expiring);

            expiring.forEach(offer -> {
                OfferHistory history = new OfferHistory();
                history.setOffer(offer);
                history.setShopkeeper(offer.getShopkeeper());
                history.setAction("EXPIRED");
                history.setPreviousStatus("APPROVED");
                history.setNewStatus("EXPIRED");
                history.setActionDate(now);
                historyRepository.save(history);
            });
        }
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 60 * 60 * 1000)
    public void scheduledExpireOffers() {
        expireOffers();
    }

    /**
     * 1. CREATE OFFER (Shopkeeper)
     * When a shopkeeper submits, it starts as 'PENDING'
     */
    @PostMapping("/create")
    public Offer createOffer(@RequestBody Offer offer) {
        LocalDateTime now = LocalDateTime.now();

        if (offer.getValidFrom() == null) {
            offer.setValidFrom(now);
        }

        if (offer.getValidUntil() == null && offer.getDurationValue() != null && offer.getDurationValue() > 0) {
            if ("HOURS".equalsIgnoreCase(offer.getDurationType())) {
                offer.setValidUntil(offer.getValidFrom().plusHours(offer.getDurationValue()));
            } else {
                offer.setValidUntil(offer.getValidFrom().plusDays(offer.getDurationValue()));
            }
        }

        if (offer.getValidUntil() != null && offer.getValidFrom() != null && offer.getValidUntil().isBefore(offer.getValidFrom())) {
            throw new IllegalArgumentException("Offer valid-until must be after valid-from");
        }

        offer.setStatus("PENDING");
        offer.setApprovedAt(null);
        offer.setRejectedAt(null);
        offer.setAdminStatusComment(null);
        Offer saved = offerRepository.save(offer);

        // Create history record for submission
        OfferHistory history = new OfferHistory();
        history.setOffer(saved);
        history.setShopkeeper(saved.getShopkeeper());
        history.setAction("SUBMITTED");
        history.setPreviousStatus(null);
        history.setNewStatus("PENDING");
        history.setActionDate(LocalDateTime.now());
        historyRepository.save(history);

        return saved;
    }

    /**
     * 2. GET ALL PENDING (Admin)
     * Admin uses this to see what needs approval
     */
    @GetMapping("/admin/pending")
    public List<Offer> getPendingOffers() {
        return offerRepository.findByStatus("PENDING");
    }

    /**
     * 3. APPROVE OFFER (Admin)
     * Changes status from PENDING to APPROVED
     * Checks subscription limits before approving
     */
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approveOffer(@PathVariable Long id, @RequestParam(required = false) Long adminId) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + id));
        
        if (!"PENDING".equals(offer.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Offer is not pending approval"));
        }

        // Check subscription limits
        User shopkeeper = offer.getShopkeeper();
        if (shopkeeper == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Offer has no associated shopkeeper"));
        }

        AdminSettings settings = settingsRepository.findFirstByOrderByIdAsc();
        if (settings == null) {
            settings = new AdminSettings();
            settings = settingsRepository.save(settings);
        }

        Optional<Subscription> activeSub = subscriptionRepository.findActiveSubscriptionForShopkeeper(
                shopkeeper.getId(), LocalDateTime.now());

        int offerLimit;
        Subscription subscription = null;

        if (activeSub.isPresent()) {
            subscription = activeSub.get();
            // Check and reset if period changed
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime lastReset = subscription.getLastResetDate();
            boolean needsReset = false;

            if ("MONTHLY".equals(subscription.getDurationType())) {
                if (lastReset.getMonth() != now.getMonth() || lastReset.getYear() != now.getYear()) {
                    needsReset = true;
                }
                offerLimit = subscription.getSubscriptionPackage().getMonthlyOfferLimit();
            } else {
                if (lastReset.getYear() != now.getYear()) {
                    needsReset = true;
                }
                offerLimit = subscription.getSubscriptionPackage().getYearlyOfferLimit();
            }

            if (needsReset) {
                subscription.setOffersUsedThisPeriod(0);
                subscription.setLastResetDate(now);
            }

            if (subscription.getOffersUsedThisPeriod() >= offerLimit) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Offer limit reached",
                    "limit", offerLimit,
                    "used", subscription.getOffersUsedThisPeriod(),
                    "message", "Shopkeeper has reached their subscription offer limit for this period"
                ));
            }
        } else {
            // No active subscription - use default limits
            if (settings.getRequireSubscriptionForOffers()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "No active subscription",
                    "message", "Shopkeeper must have an active subscription to display offers"
                ));
            }
            // Use default limits
            LocalDateTime now = LocalDateTime.now();
            long approvedThisMonth = offerRepository.findByShopkeeperId(shopkeeper.getId()).stream()
                    .filter(o -> "APPROVED".equals(o.getStatus()) && o.getApprovedAt() != null
                            && o.getApprovedAt().getMonth() == now.getMonth()
                            && o.getApprovedAt().getYear() == now.getYear())
                    .count();
            if (approvedThisMonth >= settings.getDefaultMonthlyOfferLimit()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Monthly offer limit reached",
                    "limit", settings.getDefaultMonthlyOfferLimit(),
                    "used", approvedThisMonth
                ));
            }
            offerLimit = settings.getDefaultMonthlyOfferLimit();
        }

        // Approve the offer
        String previousStatus = offer.getStatus();
        offer.setStatus("APPROVED");
        offer.setApprovedAt(LocalDateTime.now());
        offer.setRejectedAt(null);
        Offer saved = offerRepository.save(offer);

        // Update subscription usage
        if (subscription != null) {
            subscription.setOffersUsedThisPeriod(subscription.getOffersUsedThisPeriod() + 1);
            subscriptionRepository.save(subscription);
        }

        // Create history record
        OfferHistory history = new OfferHistory();
        history.setOffer(saved);
        history.setShopkeeper(shopkeeper);
        if (adminId != null) {
            userRepository.findById(adminId).ifPresent(history::setAdmin);
        }
        history.setAction("APPROVED");
        history.setPreviousStatus(previousStatus);
        history.setNewStatus("APPROVED");
        history.setActionDate(LocalDateTime.now());
        historyRepository.save(history);

        // Notify shopkeeper
        try {
            notificationService.offerApproved(saved);
        } catch (Exception ignored) {}

        return ResponseEntity.ok(saved);
    }

    /**
     * 3b. REJECT OFFER (Admin) with optional comment
     */
    @PutMapping("/admin/reject/{id}")
    public Offer rejectOffer(@PathVariable Long id, 
                            @RequestBody(required = false) RejectRequest body,
                            @RequestParam(required = false) Long adminId) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + id));
        
        String previousStatus = offer.getStatus();
        String comment = body != null ? body.getComment() : null;
        
        offer.setStatus("REJECTED");
        offer.setRejectedAt(LocalDateTime.now());
        if (comment != null) {
            offer.setAdminStatusComment(comment);
        }
        Offer saved = offerRepository.save(offer);

        // Create history record
        OfferHistory history = new OfferHistory();
        history.setOffer(saved);
        history.setShopkeeper(offer.getShopkeeper());
        if (adminId != null) {
            userRepository.findById(adminId).ifPresent(history::setAdmin);
        }
        history.setAction("REJECTED");
        history.setPreviousStatus(previousStatus);
        history.setNewStatus("REJECTED");
        history.setComment(comment);
        history.setActionDate(LocalDateTime.now());
        historyRepository.save(history);

        // Notify shopkeeper
        try {
            notificationService.offerRejected(saved, comment);
        } catch (Exception ignored) {}

        return saved;
    }

    /**
     * Get offer history for a shopkeeper
     */
    @GetMapping("/history/{shopkeeperId}")
    public ResponseEntity<List<OfferHistory>> getOfferHistory(@PathVariable Long shopkeeperId) {
        return ResponseEntity.ok(historyRepository.findShopkeeperHistory(shopkeeperId));
    }

    /**
     * 3c. Set Top 5 offers (admin curated)
     * Expects up to 5 offer IDs in desired order of priority.
     */
    @PutMapping("/admin/top5")
    public ResponseEntity<Void> setTopFive(@RequestBody TopFiveRequest request) {
        // Clear existing pinned ranks
        List<Offer> allOffers = offerRepository.findAll();
        allOffers.forEach(o -> o.setPinnedRank(null));

        if (request != null && request.getOfferIds() != null) {
            int rank = 1;
            for (Long id : request.getOfferIds()) {
                if (id == null) continue;
                Optional<Offer> opt = allOffers.stream()
                        .filter(o -> o.getId().equals(id))
                        .findFirst();
                if (opt.isPresent()) {
                    Offer o = opt.get();
                    o.setPinnedRank(rank++);
                }
            }
        }

        offerRepository.saveAll(allOffers);
        return ResponseEntity.ok().build();
    }

    /**
     * 4. GET ACTIVE OFFERS (legacy, area+category filter)
     * Filters by Area, Category, and only shows APPROVED offers in-validity window
     */
    @GetMapping("/active")
    public List<Offer> getActiveOffers(
            @RequestParam String area,
            @RequestParam String category) {
        expireOffers();

        return offerRepository.findByStatusAndAreaAndCategory("APPROVED", area, category).stream()
                .filter(this::isOfferActive)
                .collect(Collectors.toList());
    }

    /**
     * 5. GET SHOPKEEPER'S OWN OFFERS
     * For the Shopkeeper Dashboard list
     */
    @GetMapping("/shopkeeper/{id}")
    public List<Offer> getShopkeeperOffers(@PathVariable Long id) {
        return offerRepository.findByShopkeeperId(id);
    }

    /**
     * 6. GENERIC LISTING for users (Home, Categories, etc.)
     * Supports:
     *  - status (defaults to APPROVED)
     *  - area, category (optional filters)
     *  - sort = newest|trending|top5 (simple in-memory sort)
     *  - limit
     */
    @GetMapping
    public ResponseEntity<List<Offer>> listOffers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false) Integer limit) {

        expireOffers();

        String effectiveStatus = (status == null || status.isEmpty()) ? "APPROVED" : status;

        List<Offer> offers = offerRepository.findByStatus(effectiveStatus);
        if ("APPROVED".equalsIgnoreCase(effectiveStatus)) {
            offers = offers.stream().filter(this::isOfferActive).collect(Collectors.toList());
        }

        if (area != null && !area.isEmpty()) {
            offers = offers.stream()
                    .filter(o -> o.getArea() != null && o.getArea().equalsIgnoreCase(area))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.isEmpty()) {
            offers = offers.stream()
                    .filter(o -> o.getCategory() != null && o.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        // Simple sort strategies
        if ("top5".equalsIgnoreCase(sort) || "trending".equalsIgnoreCase(sort)) {
            // Pinned offers first (lower pinnedRank is higher priority), then newest approvedAt
            offers = offers.stream()
                    .sorted(Comparator
                            .comparing((Offer o) -> o.getPinnedRank() == null ? Integer.MAX_VALUE : o.getPinnedRank())
                            .thenComparing((Offer o) -> Optional.ofNullable(o.getApprovedAt()).orElse(LocalDateTime.MIN))
                            .reversed())
                    .collect(Collectors.toList());
        } else if ("newest".equalsIgnoreCase(sort)) {
            offers = offers.stream()
                    .sorted(Comparator.comparing(
                            (Offer o) -> Optional.ofNullable(o.getApprovedAt()).orElse(LocalDateTime.MIN))
                            .reversed())
                    .collect(Collectors.toList());
        }

        if (limit != null && limit > 0 && offers.size() > limit) {
            offers = offers.subList(0, limit);
        }

        return ResponseEntity.ok(offers);
    }

    /**
     * 7. GET SINGLE OFFER BY ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOffer(@PathVariable Long id) {
        return offerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Simple DTO for reject comment
    public static class RejectRequest {
        private String comment;

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }

    public static class TopFiveRequest {
        private java.util.List<Long> offerIds;

        public java.util.List<Long> getOfferIds() {
            return offerIds;
        }

        public void setOfferIds(java.util.List<Long> offerIds) {
            this.offerIds = offerIds;
        }
    }
}