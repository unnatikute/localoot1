package com.localoot.localoot.controller;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.localoot.localoot.model.SubscriptionPackage;
import com.localoot.localoot.repository.SubscriptionPackageRepository;

/**
 * Minimal payment gateway integration endpoints (test mode).
 *
 * - Stripe: creates a Checkout Session and returns its hosted URL.
 * - Razorpay: creates an Order and returns order details for Checkout JS.
 *
 * Note: This is intentionally lightweight and uses built-in HttpClient (no SDK dependency).
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentGatewayController {

    private final SubscriptionPackageRepository packageRepository;

    @Value("${app.payments.currency:INR}")
    private String currency;

    @Value("${app.stripe.secretKey:}")
    private String stripeSecretKey;

    @Value("${app.razorpay.keyId:}")
    private String razorpayKeyId;

    @Value("${app.razorpay.keySecret:}")
    private String razorpayKeySecret;

    public PaymentGatewayController(SubscriptionPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @PostMapping("/stripe/checkout-session")
    public ResponseEntity<?> createStripeCheckoutSession(@RequestBody CheckoutRequest request) throws Exception {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Stripe secret key not configured"));
        }

        SubscriptionPackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        double amount = "YEARLY".equalsIgnoreCase(request.getDurationType())
                ? (pkg.getYearlyPrice() != null ? pkg.getYearlyPrice() : 0.0)
                : (pkg.getMonthlyPrice() != null ? pkg.getMonthlyPrice() : 0.0);

        // Stripe requires amounts in the smallest currency unit for many currencies (e.g. paise for INR)
        long amountMinor = Math.round(amount * 100);

        String successUrl = request.getSuccessUrl() != null && !request.getSuccessUrl().isBlank()
                ? request.getSuccessUrl()
                : "http://localhost:5173/shopkeeper-subscription?payment=success";
        String cancelUrl = request.getCancelUrl() != null && !request.getCancelUrl().isBlank()
                ? request.getCancelUrl()
                : "http://localhost:5173/shopkeeper-subscription?payment=cancel";

        String body = formEncode(Map.of(
                "mode", "payment",
                "success_url", successUrl,
                "cancel_url", cancelUrl,
                "line_items[0][quantity]", "1",
                "line_items[0][price_data][currency]", currency.toLowerCase(),
                "line_items[0][price_data][unit_amount]", String.valueOf(amountMinor),
                "line_items[0][price_data][product_data][name]", pkg.getName() + " (" + request.getDurationType() + ")",
                "line_items[0][price_data][product_data][description]", safe(pkg.getDescription())
        ));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.stripe.com/v1/checkout/sessions"))
                .header("Authorization", "Bearer " + stripeSecretKey)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> res = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (res.statusCode() >= 400) {
            return ResponseEntity.status(res.statusCode()).body(Map.of("error", "Stripe error", "details", res.body()));
        }

        // Return raw JSON (contains 'url' field). Frontend can parse and redirect.
        return ResponseEntity.ok(Map.of("stripeResponse", res.body()));
    }

    @PostMapping("/razorpay/order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody CheckoutRequest request) throws Exception {
        if (razorpayKeyId == null || razorpayKeyId.isBlank() || razorpayKeySecret == null || razorpayKeySecret.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Razorpay keys not configured"));
        }

        SubscriptionPackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        double amount = "YEARLY".equalsIgnoreCase(request.getDurationType())
                ? (pkg.getYearlyPrice() != null ? pkg.getYearlyPrice() : 0.0)
                : (pkg.getMonthlyPrice() != null ? pkg.getMonthlyPrice() : 0.0);

        long amountPaise = Math.round(amount * 100);
        String json = "{"
                + "\"amount\":" + amountPaise + ","
                + "\"currency\":\"" + currency + "\","
                + "\"receipt\":\"rcpt_" + LocalDateTime.now().toString().replace(':', '_') + "\""
                + "}";

        String basicAuth = Base64.getEncoder()
                .encodeToString((razorpayKeyId + ":" + razorpayKeySecret).getBytes(StandardCharsets.UTF_8));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.razorpay.com/v1/orders"))
                .header("Authorization", "Basic " + basicAuth)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> res = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (res.statusCode() >= 400) {
            return ResponseEntity.status(res.statusCode()).body(Map.of("error", "Razorpay error", "details", res.body()));
        }

        return ResponseEntity.ok(Map.of(
                "keyId", razorpayKeyId,
                "orderResponse", res.body()
        ));
    }

    private static String formEncode(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> e : params.entrySet()) {
            if (sb.length() > 0) sb.append("&");
            sb.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8));
            sb.append("=");
            sb.append(URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8));
        }
        return sb.toString();
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }

    public static class CheckoutRequest {
        private Long packageId;
        private String durationType; // MONTHLY / YEARLY
        private String successUrl;
        private String cancelUrl;

        public Long getPackageId() { return packageId; }
        public void setPackageId(Long packageId) { this.packageId = packageId; }
        public String getDurationType() { return durationType; }
        public void setDurationType(String durationType) { this.durationType = durationType; }
        public String getSuccessUrl() { return successUrl; }
        public void setSuccessUrl(String successUrl) { this.successUrl = successUrl; }
        public String getCancelUrl() { return cancelUrl; }
        public void setCancelUrl(String cancelUrl) { this.cancelUrl = cancelUrl; }
    }
}

