package com.localoot.localoot.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import com.localoot.localoot.model.AdminSettings;
import com.localoot.localoot.model.Payment;
import com.localoot.localoot.model.Subscription;
import com.localoot.localoot.model.SubscriptionPackage;
import com.localoot.localoot.model.User;
import com.localoot.localoot.repository.AdminSettingsRepository;
import com.localoot.localoot.repository.PaymentRepository;
import com.localoot.localoot.repository.SubscriptionPackageRepository;
import com.localoot.localoot.repository.SubscriptionRepository;
import com.localoot.localoot.repository.UserRepository;
import com.localoot.localoot.service.NotificationService;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionPackageRepository packageRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AdminSettingsRepository settingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // ============= SUBSCRIPTION PACKAGES (Admin) =============

    @GetMapping("/packages")
    public ResponseEntity<List<SubscriptionPackage>> getAllPackages(@RequestParam(required = false) Boolean active) {
        if (active != null && active) {
            return ResponseEntity.ok(packageRepository.findByIsActiveTrueOrderByDisplayOrderAsc());
        }
        return ResponseEntity.ok(packageRepository.findAll());
    }

    @PostMapping("/packages")
    public ResponseEntity<SubscriptionPackage> createPackage(@RequestBody SubscriptionPackage pkg) {
        return ResponseEntity.ok(packageRepository.save(pkg));
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<SubscriptionPackage> updatePackage(@PathVariable Long id,
            @RequestBody SubscriptionPackage pkg) {
        SubscriptionPackage existing = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        pkg.setId(id);
        pkg.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(packageRepository.save(pkg));
    }

    // ============= SUBSCRIPTIONS (Shopkeeper) =============

    @GetMapping("/my-subscription")
    public ResponseEntity<?> getMySubscription(@RequestParam Long shopkeeperId) {

        Optional<Subscription> subOpt = subscriptionRepository
                .findActiveSubscriptionForShopkeeper(shopkeeperId, LocalDateTime.now());

        // ✅ No subscription
        if (subOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "subscription", null,
                    "message", "No active subscription"));
        }

        Subscription s = subOpt.get();

        // ✅ FIX OLD DATA ISSUES
        if (s.getSubscriptionPackage() == null) {
            return ResponseEntity.status(500).body("Subscription package missing for this user");
        }

        if (s.getDurationType() == null) {
            s.setDurationType("MONTHLY"); // default fix
        }

        if (s.getLastResetDate() == null) {
            s.setLastResetDate(LocalDateTime.now());
        }

        if (s.getEndDate() == null) {
            s.setEndDate(LocalDateTime.now().plusMonths(1));
        }

        Map<String, Object> response = new HashMap<>();

        response.put("subscription", s);
        response.put("package", s.getSubscriptionPackage());
        response.put("offersUsed", s.getOffersUsedThisPeriod());
        response.put("shopkeeperName",
                s.getShopkeeper() != null ? s.getShopkeeper().getName() : "");

        int limit = "MONTHLY".equalsIgnoreCase(s.getDurationType())
                ? s.getSubscriptionPackage().getMonthlyOfferLimit()
                : s.getSubscriptionPackage().getYearlyOfferLimit();

        response.put("offersLimit", limit);

        long daysRemaining = java.time.temporal.ChronoUnit.DAYS
                .between(LocalDateTime.now(), s.getEndDate());

        response.put("daysRemaining", Math.max(daysRemaining, 0));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> createSubscription(@RequestBody SubscriptionRequest request) {
        User shopkeeper = userRepository.findById(request.getShopkeeperId())
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));
        SubscriptionPackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Check if already has active subscription
        Optional<Subscription> existing = subscriptionRepository.findActiveSubscriptionForShopkeeper(
                request.getShopkeeperId(), LocalDateTime.now());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Active subscription already exists"));
        }

        Subscription subscription = new Subscription();
        subscription.setShopkeeper(shopkeeper);
        subscription.setSubscriptionPackage(pkg);
        subscription.setDurationType(request.getDurationType());
        subscription.setStartDate(LocalDateTime.now());

        if ("MONTHLY".equals(request.getDurationType())) {
            subscription.setEndDate(LocalDateTime.now().plusMonths(1));
        } else {
            subscription.setEndDate(LocalDateTime.now().plusYears(1));
        }
        subscription.setStatus("ACTIVE");
        subscription.setOffersUsedThisPeriod(0);
        subscription.setLastResetDate(LocalDateTime.now());

        Subscription saved = subscriptionRepository.save(subscription);

        // Create payment record
        Payment payment = new Payment();
        payment.setShopkeeper(shopkeeper);
        payment.setSubscription(saved);
        payment.setSubscriptionPackage(pkg);
        payment.setAmount("MONTHLY".equals(request.getDurationType()) ? pkg.getMonthlyPrice() : pkg.getYearlyPrice());
        payment.setStatus("COMPLETED"); // In real app, this would be set after payment gateway confirmation
        payment.setPeriodStart(saved.getStartDate());
        payment.setPeriodEnd(saved.getEndDate());
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        // Notify shopkeeper of payment confirmation
        try {
            notificationService.paymentConfirmed(savedPayment);
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok(saved);
    }

    /**
     * Renew an existing subscription (extends end date and creates a new payment
     * record).
     * If no active subscription exists, this behaves like subscribe (requires
     * packageId).
     */
    @PostMapping("/renew")
    public ResponseEntity<?> renewSubscription(@RequestBody RenewalRequest request) {
        if (request.getShopkeeperId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "shopkeeperId is required"));
        }
        if (request.getDurationType() == null || request.getDurationType().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "durationType is required"));
        }

        User shopkeeper = userRepository.findById(request.getShopkeeperId())
                .orElseThrow(() -> new RuntimeException("Shopkeeper not found"));

        Optional<Subscription> activeOpt = subscriptionRepository.findActiveSubscriptionForShopkeeper(
                request.getShopkeeperId(), LocalDateTime.now());

        Subscription subscription;
        SubscriptionPackage pkg;

        if (activeOpt.isPresent()) {
            subscription = activeOpt.get();
            pkg = subscription.getSubscriptionPackage();
        } else {
            if (request.getPackageId() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "packageId is required when no active subscription exists"));
            }
            pkg = packageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Package not found"));
            subscription = new Subscription();
            subscription.setShopkeeper(shopkeeper);
            subscription.setSubscriptionPackage(pkg);
            subscription.setStartDate(LocalDateTime.now());
            subscription.setStatus("ACTIVE");
            subscription.setOffersUsedThisPeriod(0);
            subscription.setLastResetDate(LocalDateTime.now());
        }

        subscription.setDurationType(request.getDurationType());

        LocalDateTime base = subscription.getEndDate() != null && subscription.getEndDate().isAfter(LocalDateTime.now())
                ? subscription.getEndDate()
                : LocalDateTime.now();

        if ("MONTHLY".equalsIgnoreCase(request.getDurationType())) {
            subscription.setEndDate(base.plusMonths(1));
        } else {
            subscription.setEndDate(base.plusYears(1));
        }

        subscription.setStatus("ACTIVE");
        subscription.setUpdatedAt(LocalDateTime.now());

        // Reset usage at renewal
        subscription.setOffersUsedThisPeriod(0);
        subscription.setLastResetDate(LocalDateTime.now());

        Subscription saved = subscriptionRepository.save(subscription);

        // Create payment record
        Payment payment = new Payment();
        payment.setShopkeeper(shopkeeper);
        payment.setSubscription(saved);
        payment.setSubscriptionPackage(pkg);
        payment.setAmount(
                "MONTHLY".equalsIgnoreCase(request.getDurationType()) ? pkg.getMonthlyPrice() : pkg.getYearlyPrice());
        payment.setStatus("COMPLETED");
        payment.setPeriodStart(LocalDateTime.now());
        payment.setPeriodEnd(saved.getEndDate());
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        try {
            notificationService.paymentConfirmed(savedPayment);
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Subscription>> getSubscriptionHistory(@RequestParam Long shopkeeperId) {
        return ResponseEntity.ok(subscriptionRepository.findByShopkeeperId(shopkeeperId));
    }

    // ============= PAYMENTS =============

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getPayments(@RequestParam Long shopkeeperId,
            @RequestParam(required = false) String period) {
        List<Payment> payments = paymentRepository.findByShopkeeperId(shopkeeperId);

        if (period != null) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime start;
            if ("month".equalsIgnoreCase(period)) {
                start = now.minusMonths(1);
            } else if ("year".equalsIgnoreCase(period)) {
                start = now.minusYears(1);
            } else {
                return ResponseEntity.ok(payments);
            }
            payments = paymentRepository.findPaymentsByShopkeeperAndPeriod(shopkeeperId, start, now);
        }

        return ResponseEntity.ok(payments);
    }

    /**
     * Download invoice PDF for a payment.
     */
    @GetMapping("/payments/{paymentId}/invoice.pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long paymentId) throws IOException {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        byte[] pdfBytes = buildInvoicePdf(payment);

        String filename = (payment.getInvoiceNumber() != null && !payment.getInvoiceNumber().isBlank())
                ? payment.getInvoiceNumber() + ".pdf"
                : ("invoice-" + paymentId + ".pdf");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(pdfBytes);
    }

    private byte[] buildInvoicePdf(Payment payment) throws IOException {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                float margin = 50;
                float y = page.getMediaBox().getHeight() - margin;
                float leading = 16;

                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);

                cs.newLineAtOffset(margin, y);
                cs.showText("LocalLoot Invoice");
                cs.endText();

                y -= 30;

                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                cs.newLineAtOffset(margin, y);
                cs.showText("Invoice Number: " + safe(payment.getInvoiceNumber()));
                cs.newLineAtOffset(0, -leading);
                cs.showText("Date: "
                        + (payment.getPaymentDate() != null ? payment.getPaymentDate().toLocalDate().toString() : ""));
                cs.newLineAtOffset(0, -leading);
                cs.showText("Shopkeeper: "
                        + (payment.getShopkeeper() != null ? safe(payment.getShopkeeper().getName()) : ""));
                cs.newLineAtOffset(0, -leading);
                cs.showText(
                        "Email: " + (payment.getShopkeeper() != null ? safe(payment.getShopkeeper().getEmail()) : ""));
                cs.newLineAtOffset(0, -leading);
                cs.showText("Package: "
                        + (payment.getSubscriptionPackage() != null ? safe(payment.getSubscriptionPackage().getName())
                                : ""));
                cs.newLineAtOffset(0, -leading);
                cs.showText("Amount: " + safe(payment.getCurrency()) + " "
                        + (payment.getAmount() != null ? payment.getAmount() : ""));
                cs.newLineAtOffset(0, -leading);
                cs.showText("Status: " + safe(payment.getStatus()));
                cs.newLineAtOffset(0, -leading);
                if (payment.getPeriodStart() != null && payment.getPeriodEnd() != null) {
                    cs.showText("Period: " + payment.getPeriodStart().toLocalDate() + " to "
                            + payment.getPeriodEnd().toLocalDate());
                    cs.newLineAtOffset(0, -leading);
                }
                cs.endText();
            }

            doc.save(out);
            return out.toByteArray();
        }
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }

    // ============= ADMIN SETTINGS =============

    @GetMapping("/admin/settings")
    public ResponseEntity<AdminSettings> getSettings() {
        AdminSettings settings = settingsRepository.findFirstByOrderByIdAsc();
        if (settings == null) {
            // Create default settings
            settings = new AdminSettings();
            settings = settingsRepository.save(settings);
        }
        return ResponseEntity.ok(settings);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelSubscription(@PathVariable Long id) {

        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        sub.setStatus("CANCELLED");
        sub.setEndDate(LocalDateTime.now());

        subscriptionRepository.save(sub);

        return ResponseEntity.ok("Subscription cancelled successfully");
    }

    @PutMapping("/admin/settings")
    public ResponseEntity<AdminSettings> updateSettings(@RequestBody AdminSettings newSettings) {
        AdminSettings existing = settingsRepository.findFirstByOrderByIdAsc();
        if (existing == null) {
            existing = new AdminSettings();
        }
        newSettings.setId(existing.getId());
        newSettings.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(settingsRepository.save(newSettings));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')") // Only accessible by admin users
    public ResponseEntity<List<Map<String, Object>>> getAllSubscriptionsDto() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Subscription s : subscriptions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("shopkeeperName", s.getShopkeeper() != null ? s.getShopkeeper().getName() : "");
            map.put("packageName", s.getSubscriptionPackage() != null ? s.getSubscriptionPackage().getName() : "");
            map.put("status", s.getStatus());
            map.put("startDate", s.getStartDate());
            map.put("endDate", s.getEndDate());
            map.put("offersUsed", s.getOffersUsedThisPeriod());
            list.add(map);
        }

        return ResponseEntity.ok(list);
    }

    // ============= DTOs =============

    public static class SubscriptionRequest {
        private Long shopkeeperId;
        private Long packageId;
        private String durationType; // "MONTHLY" or "YEARLY"

        public Long getShopkeeperId() {
            return shopkeeperId;
        }

        public void setShopkeeperId(Long shopkeeperId) {
            this.shopkeeperId = shopkeeperId;
        }

        public Long getPackageId() {
            return packageId;
        }

        public void setPackageId(Long packageId) {
            this.packageId = packageId;
        }

        public String getDurationType() {
            return durationType;
        }

        public void setDurationType(String durationType) {
            this.durationType = durationType;
        }
    }

    public static class RenewalRequest {
        private Long shopkeeperId;
        private Long packageId;
        private String durationType; // "MONTHLY" or "YEARLY"

        public Long getShopkeeperId() {
            return shopkeeperId;
        }

        public void setShopkeeperId(Long shopkeeperId) {
            this.shopkeeperId = shopkeeperId;
        }

        public Long getPackageId() {
            return packageId;
        }

        public void setPackageId(Long packageId) {
            this.packageId = packageId;
        }

        public String getDurationType() {
            return durationType;
        }

        public void setDurationType(String durationType) {
            this.durationType = durationType;
        }
    }
}
