package com.localoot.localoot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.localoot.localoot.model.Offer;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByStatus(String status);
    List<Offer> findByShopkeeperId(Long id);
    
    // For the Customer app filtering
    List<Offer> findByStatusAndAreaAndCategory(String status, String area, String category);
}