package com.localoot.localoot.repository;

import com.localoot.localoot.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    Shop findByShopkeeperId(Long shopkeeperId);

  
    long countByRegistrationStatus(String status);

    List<Shop> findByRegistrationStatus(String status);
@Query(value = "SELECT DATE_FORMAT(registration_date, '%Y-%m') as month, COUNT(*) " +
               "FROM shop GROUP BY month ORDER BY month",
       nativeQuery = true)
List<Object[]> getShopsRegisteredByMonth();


}