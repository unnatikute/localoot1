package com.localoot.localoot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.localoot.localoot.model.SubscriptionPackage;

@Repository
public interface SubscriptionPackageRepository extends JpaRepository<SubscriptionPackage, Long> {
    List<SubscriptionPackage> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<SubscriptionPackage> findByIsActive(Boolean isActive);
}
