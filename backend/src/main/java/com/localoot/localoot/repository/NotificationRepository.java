package com.localoot.localoot.repository;

import java.util.List;   // ✅ VERY IMPORTANT

import org.springframework.data.jpa.repository.JpaRepository;

import com.localoot.localoot.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}