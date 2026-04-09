package com.localoot.localoot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.localoot.localoot.model.Offer;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByStatus(String status);

    List<Offer> findByShopkeeperId(Long id);

    // ✅ ADD THIS (IMPORTANT)
    long countByShopkeeperIdAndStatus(Long shopkeeperId, String status);
long usedTopOffers = offerRepository.countTopOffersByShopId(
    offer.getShopkeeper().getId()
);

    // For the Customer app filtering
    List<Offer> findByStatusAndAreaAndCategory(String status, String area, String category);

    // Top 5 sorting
    @Query("SELECT o FROM Offer o WHERE o.status = 'APPROVED' ORDER BY o.validFrom ASC")
    List<Offer> findAllApprovedOffersForTop5();

   @Query("SELECT COUNT(o) FROM Offer o WHERE o.shopkeeper.id = :shopkeeperId AND o.pinnedRank IS NOT NULL")
long countTopOffersByShopId(@org.springframework.data.repository.query.Param("shopkeeperId") Long shopkeeperId);
}