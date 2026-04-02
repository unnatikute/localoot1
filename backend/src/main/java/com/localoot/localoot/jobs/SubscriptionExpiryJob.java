package com.localoot.localoot.jobs;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.localoot.localoot.model.AdminSettings;
import com.localoot.localoot.model.Subscription;
import com.localoot.localoot.repository.AdminSettingsRepository;
import com.localoot.localoot.repository.SubscriptionRepository;
import com.localoot.localoot.service.NotificationService;

@Component
public class SubscriptionExpiryJob {
    private final SubscriptionRepository subscriptionRepository;
    private final AdminSettingsRepository settingsRepository;
    private final NotificationService notificationService;

    public SubscriptionExpiryJob(
            SubscriptionRepository subscriptionRepository,
            AdminSettingsRepository settingsRepository,
            NotificationService notificationService) {
        this.subscriptionRepository = subscriptionRepository;
        this.settingsRepository = settingsRepository;
        this.notificationService = notificationService;
    }

    // Runs daily at 9:00 AM server time
    @Scheduled(cron = "0 0 9 * * *")
    public void notifyExpiringSubscriptions() {
        AdminSettings settings = settingsRepository.findFirstByOrderByIdAsc();
        int days = settings != null && settings.getDaysBeforeExpiryToNotify() != null
                ? settings.getDaysBeforeExpiryToNotify()
                : 7;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threshold = now.plusDays(days);

        List<Subscription> active = subscriptionRepository.findByStatus("ACTIVE");
        for (Subscription s : active) {
            if (s.getEndDate() == null) continue;
            if (s.getEndDate().isAfter(now) && (s.getEndDate().isBefore(threshold) || s.getEndDate().isEqual(threshold))) {
                long remaining = ChronoUnit.DAYS.between(now, s.getEndDate());
                notificationService.subscriptionExpiring(s, remaining);
            }
        }
    }
}

