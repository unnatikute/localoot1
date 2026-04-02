package com.localoot.localoot.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shopkeeper_id")
    private User shopkeeper;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private SubscriptionPackage subscriptionPackage;

    // Payment details
    private Double amount;
    private String currency = "INR";
    private String paymentMethod; // "CREDIT_CARD", "DEBIT_CARD", "UPI", "BANK_TRANSFER", etc.
    private String transactionId; // External payment gateway transaction ID
    private String invoiceNumber; // Auto-generated invoice number
    
    // Status
    private String status; // "PENDING", "COMPLETED", "FAILED", "REFUNDED"
    
    // Period covered
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    
    // Metadata
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private String notes; // Additional notes or payment gateway response

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.paymentDate == null) {
            this.paymentDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.currency == null) {
            this.currency = "INR";
        }
        // Generate invoice number if not provided
        if (this.invoiceNumber == null || this.invoiceNumber.isEmpty()) {
            this.invoiceNumber = "INV-" + System.currentTimeMillis() + "-" + (this.shopkeeper != null ? this.shopkeeper.getId() : "000");
        }
    }
}
