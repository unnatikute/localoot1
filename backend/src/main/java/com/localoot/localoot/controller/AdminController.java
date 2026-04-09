package com.localoot.localoot.controller;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.localoot.localoot.dto.UserDetailsDTO;
import com.localoot.localoot.model.*;
import com.localoot.localoot.repository.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    // ================= SHOP =================

    @GetMapping("/shops")
    public ResponseEntity<?> getAllShops(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String search) {

        List<Shop> shops = shopRepository.findAll();

        if (month != null && !month.isEmpty()) {
            shops = shops.stream()
                    .filter(s -> s.getRegistrationDate() != null &&
                            s.getRegistrationDate().toString().startsWith(month))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            shops = shops.stream()
                    .filter(s -> s.getShopName().toLowerCase().contains(searchLower) ||
                            s.getEmail().toLowerCase().contains(searchLower) ||
                            s.getOwnerName().toLowerCase().contains(searchLower))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(shops);
    }

    @GetMapping("/shops/stats")
    public ResponseEntity<?> getShopStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalShops", shopRepository.count());
        stats.put("approvedShops", shopRepository.countByRegistrationStatus("APPROVED"));
        stats.put("pendingShops", shopRepository.countByRegistrationStatus("PENDING"));
        stats.put("rejectedShops", shopRepository.countByRegistrationStatus("REJECTED"));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/shops/{id}")
    public ResponseEntity<?> getShopDetails(@PathVariable Long id) {
        return shopRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/shops/{id}/approve")
    public ResponseEntity<?> approveShop(@PathVariable Long id) {
        Optional<Shop> shop = shopRepository.findById(id);
        if (shop.isPresent()) {
            Shop s = shop.get();
            s.setRegistrationStatus("APPROVED");
            shopRepository.save(s);
            return ResponseEntity.ok("Approved");
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/shops/{id}/reject")
    public ResponseEntity<?> rejectShop(@PathVariable Long id) {
        Optional<Shop> shop = shopRepository.findById(id);
        if (shop.isPresent()) {
            Shop s = shop.get();
            s.setRegistrationStatus("REJECTED");
            shopRepository.save(s);
            return ResponseEntity.ok("Rejected");
        }
        return ResponseEntity.notFound().build();
    }

    // ================= USERS =================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {

        List<User> users = (role != null && !role.isEmpty())
                ? userRepository.findByRole(role)
                : userRepository.findAll();

        if (search != null && !search.isEmpty()) {
            String s = search.toLowerCase();
            users = users.stream()
                    .filter(u -> u.getName().toLowerCase().contains(s) ||
                            u.getEmail().toLowerCase().contains(s))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long id) {

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty())
            return ResponseEntity.notFound().build();

        User user = userOpt.get();

        UserDetailsDTO dto = new UserDetailsDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getLastLoginDate(),
                getInt(user.getAccountVisits()),
                getInt(user.getProfileViews()),
                getInt(user.getLikesCount()),
                getInt(user.getBookmarksCount()),
                getInt(user.getShopsVisited()),
                getInt(user.getEngagementScore()));

        dto.setConnectedShopsCount((int) shopRepository.count());
        return ResponseEntity.ok(dto);
    }

    // ================= OFFERS =================

    @GetMapping("/offers/admin/approved-with-plan")
public ResponseEntity<?> getApprovedOffersWithPlan() {

    List<Offer> offers = offerRepository.findByStatus("APPROVED");

    List<Map<String, Object>> result = offers.stream().map(offer -> {

        Map<String, Object> map = new HashMap<>();

        map.put("id", offer.getId());
        map.put("title", offer.getTitle());
        map.put("shopName", offer.getShopName());

        Long shopkeeperId = (offer.getShopkeeper() != null)
                ? offer.getShopkeeper().getId()
                : null;

        String planName = "Basic";
        String shopkeeperName = "Unknown";
        int maxTopOffers = 1;

        if (shopkeeperId != null) {

            // 👤 Shopkeeper Name
            Optional<User> userOpt = userRepository.findById(shopkeeperId);
            if (userOpt.isPresent()) {
                shopkeeperName = userOpt.get().getName();
            }

            // 💎 Active Subscription
            Optional<Subscription> subOpt =
                subscriptionRepository.findActiveSubscriptionForShopkeeper(
                    shopkeeperId, LocalDateTime.now()
                );

            if (subOpt.isPresent() && subOpt.get().getSubscriptionPackage() != null) {

                SubscriptionPackage pkg = subOpt.get().getSubscriptionPackage();

                planName = pkg.getName(); // Premium / Standard / Basic

                // 🎯 Plan limits
                if (planName.equalsIgnoreCase("Premium")) maxTopOffers = 5;
                else if (planName.equalsIgnoreCase("Standard")) maxTopOffers = 3;
                else maxTopOffers = 1;
            }
        }

        // ⭐ Count current selected top offers for this shop
        long usedTopOffers = offerRepository.countTopOffersByShopId(offer.getShopId());

        long remainingTopOffers = maxTopOffers - usedTopOffers;

        map.put("shopkeeperName", shopkeeperName);
        map.put("shopPlan", planName);
        map.put("maxTopOffers", maxTopOffers);
        map.put("usedTopOffers", usedTopOffers);
        map.put("remainingTopOffers", remainingTopOffers);

        return map;

    }).collect(Collectors.toList());

    return ResponseEntity.ok(result);
}

        

        
    @GetMapping("/offers/top5")
    public ResponseEntity<List<Offer>> getTop5Offers() {
        return ResponseEntity.ok(
                offerRepository.findAllApprovedOffersForTop5());
    }

    // ================= ANALYTICS =================

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {

        Map<String, Object> analytics = new HashMap<>();

        analytics.put("users", userRepository.count());
        analytics.put("shops", shopRepository.count());
        analytics.put("offers", offerRepository.count());

        double revenue = paymentRepository.findAll().stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(p -> p.getAmount() == null ? 0 : p.getAmount())
                .sum();

        analytics.put("revenue", revenue);

        return ResponseEntity.ok(analytics);
    }

    // ================= DASHBOARD =================

    @GetMapping("/dashboard/summary")
    public ResponseEntity<?> getDashboardSummary() {

        Map<String, Object> summary = new HashMap<>();

        summary.put("users", userRepository.count());
        summary.put("shops", shopRepository.count());
        summary.put("offers", offerRepository.count());

        return ResponseEntity.ok(summary);
    }

    // ================= HELPER =================

    private int getInt(Integer val) {
        return val == null ? 0 : val;
    }
}