package com.localoot.localoot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private String ownerName;
    private String email;
    private String mobileNumber;
    private String category;
    private String address;
    private String area;
    private LocalDateTime registrationDate;
    private String registrationStatus;
    private LocalDateTime createdAt;

    private Long shopkeeperId;

    // ✅ GETTERS & SETTERS

    public Long getId() { return id; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(String registrationStatus) { this.registrationStatus = registrationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getShopkeeperId() { return shopkeeperId; }
    public void setShopkeeperId(Long shopkeeperId) { this.shopkeeperId = shopkeeperId; }
   
  public LocalDateTime getRegistrationDate() {
    return registrationDate;
}


public void setRegistrationDate(LocalDateTime registrationDate) {
    this.registrationDate = registrationDate;
}
}