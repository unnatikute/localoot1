package com.localoot.localoot.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "admin_settings")
@Data
public class AdminSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Default offer limits (for shops without subscription)
    private Integer defaultMonthlyOfferLimit = 2;
    private Integer defaultYearlyOfferLimit = 24;
    
    // System settings
    private Boolean requireSubscriptionForOffers = true; // If false, allow free offers up to default limit
    private Boolean autoRenewSubscriptions = false;
    private Integer daysBeforeExpiryToNotify = 7; // Days before expiry to send notification
    
    // Payment settings
    private String defaultCurrency = "INR";
    private Boolean enablePaymentGateway = false;
    private String paymentGatewayName; // e.g., "RAZORPAY", "STRIPE", etc.
    
    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String updatedBy; // Admin user who last updated

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.defaultMonthlyOfferLimit == null) {
            this.defaultMonthlyOfferLimit = 2;
        }
        if (this.defaultYearlyOfferLimit == null) {
            this.defaultYearlyOfferLimit = 24;
        }
        if (this.requireSubscriptionForOffers == null) {
            this.requireSubscriptionForOffers = true;
        }
        if (this.defaultCurrency == null) {
            this.defaultCurrency = "INR";
        }
    }
}
