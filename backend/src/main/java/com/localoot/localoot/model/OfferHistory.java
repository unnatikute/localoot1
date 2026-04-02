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
@Table(name = "offer_history")
@Data
public class OfferHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "offer_id")
    private Offer offer;

    @ManyToOne
    @JoinColumn(name = "shopkeeper_id")
    private User shopkeeper;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin; // Admin who approved/rejected

    // Action details
    private String action; // "SUBMITTED", "APPROVED", "REJECTED", "UPDATED"
    private String previousStatus;
    private String newStatus;
    private String comment; // Admin comment or rejection reason
    
    // Metadata
    private LocalDateTime actionDate;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.actionDate == null) {
            this.actionDate = LocalDateTime.now();
        }
    }
}
