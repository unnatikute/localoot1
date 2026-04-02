package com.localoot.localoot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.localoot.localoot.model.AdminSettings;

@Repository
public interface AdminSettingsRepository extends JpaRepository<AdminSettings, Long> {
    // There should only be one settings record
    AdminSettings findFirstByOrderByIdAsc();
}
