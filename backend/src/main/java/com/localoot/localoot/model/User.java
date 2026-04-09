package com.localoot.localoot.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data // This automatically creates the getAccountVisits(), etc.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role;

    // ADD THESE FIELDS TO FIX THE ERRORS IN YOUR IMAGE
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLoginDate;
    
    private Integer accountVisits = 0;
    private Integer profileViews = 0;
    private Integer likesCount = 0;
    private Integer bookmarksCount = 0;
    private Integer shopsVisited = 0;
    private Integer engagementScore = 0;

    private String fcmToken;
}