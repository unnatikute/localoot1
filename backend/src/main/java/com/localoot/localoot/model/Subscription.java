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
@Table(name = "subscriptions")
@Data
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shopkeeper_id")
    private User shopkeeper;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private SubscriptionPackage subscriptionPackage;

    // Subscription period
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String durationType; // "MONTHLY" or "YEARLY"
    
    // Status
    private String status; // "ACTIVE", "EXPIRED", "CANCELLED"
    
    // Usage tracking
    private Integer offersUsedThisPeriod = 0; // Reset based on period
    private LocalDateTime lastResetDate; // When offersUsed was last reset
    
    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
        if (this.offersUsedThisPeriod == null) {
            this.offersUsedThisPeriod = 0;
        }
        if (this.lastResetDate == null) {
            this.lastResetDate = LocalDateTime.now();
        }
    }
}
