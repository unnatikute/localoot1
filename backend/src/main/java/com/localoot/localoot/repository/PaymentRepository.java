package com.localoot.localoot.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.localoot.localoot.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByShopkeeperId(Long shopkeeperId);
    List<Payment> findBySubscriptionId(Long subscriptionId);
    List<Payment> findByStatus(String status);
    
    @Query("SELECT p FROM Payment p WHERE p.shopkeeper.id = :shopkeeperId AND p.paymentDate >= :startDate AND p.paymentDate <= :endDate")
    List<Payment> findPaymentsByShopkeeperAndPeriod(@Param("shopkeeperId") Long shopkeeperId, 
                                                     @Param("startDate") LocalDateTime startDate, 
                                                     @Param("endDate") LocalDateTime endDate);
}
