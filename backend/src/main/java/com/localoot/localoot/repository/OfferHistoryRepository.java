package com.localoot.localoot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.localoot.localoot.model.OfferHistory;

@Repository
public interface OfferHistoryRepository extends JpaRepository<OfferHistory, Long> {
    List<OfferHistory> findByOfferId(Long offerId);
    List<OfferHistory> findByShopkeeperId(Long shopkeeperId);
    List<OfferHistory> findByAdminId(Long adminId);
    
    @Query("SELECT h FROM OfferHistory h WHERE h.shopkeeper.id = :shopkeeperId ORDER BY h.actionDate DESC")
    List<OfferHistory> findShopkeeperHistory(@Param("shopkeeperId") Long shopkeeperId);
}
