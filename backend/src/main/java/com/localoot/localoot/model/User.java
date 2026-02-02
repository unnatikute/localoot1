package com.localoot.localoot.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true)
    private String email;

    // This will store the ENCRYPTED string, not the real password
    private String password; 
    private String role;
    
    // Tracking fields
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginDate;
    private Integer accountVisits = 0;
    private Integer profileViews = 0;
    private Integer likesCount = 0;
    private Integer bookmarksCount = 0;
    private Integer shopsVisited = 0;
    private Integer engagementScore = 0;
    
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.role == null || this.role.isBlank()) {
            this.role = "USER";
        }
    }
}
