package com.localoot.localoot.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.localoot.localoot.model.Shop;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    List<Shop> findByRegistrationStatus(String status);
    List<Shop> findByShopkeeperId(Long shopkeeperId);
    
    @Query("SELECT s FROM Shop s WHERE s.registrationDate >= :startDate AND s.registrationDate <= :endDate")
    List<Shop> findByRegistrationDateRange(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(s) FROM Shop s WHERE s.registrationStatus = :status")
    Long countByRegistrationStatus(@Param("status") String status);
    
    @Query(value = "SELECT DATE_FORMAT(registration_date, '%Y-%m') as month, COUNT(*) as count " +
                   "FROM shops WHERE registration_status = 'APPROVED' " +
                   "GROUP BY DATE_FORMAT(registration_date, '%Y-%m') " +
                   "ORDER BY month DESC", nativeQuery = true)
    List<Object[]> getShopsRegisteredByMonth();
}
