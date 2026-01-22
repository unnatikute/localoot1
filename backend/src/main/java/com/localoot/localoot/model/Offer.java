package com.localoot.localoot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "offers")
@Data
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String area;
    private String shopName;
    private String address;
    private String googleMapUrl;
    private String mobileNumber;
    private String imageUrl;
    
    // Default status is PENDING until Admin approves
    private String status = "PENDING"; 

    @ManyToOne
    @JoinColumn(name = "shopkeeper_id")
    private User shopkeeper;
}