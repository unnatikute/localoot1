package com.localoot.localoot.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;

import com.localoot.localoot.model.Notification;
import com.localoot.localoot.model.Offer;
import com.localoot.localoot.model.Payment;
import com.localoot.localoot.model.Subscription;
import com.localoot.localoot.model.User;
import com.localoot.localoot.repository.NotificationRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;  // ✅ Use EmailService

    // ----------------- DB Notification -----------------
    public void sendNotification(User user, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setType(type);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    // ----------------- Push Notification -----------------
    public void sendPushNotification(User user, String title, String body) {
        try {
            if (user.getFcmToken() == null) return;

            com.google.firebase.messaging.Notification notification =
                    com.google.firebase.messaging.Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build();

            Message message = Message.builder()
                    .setToken(user.getFcmToken())
                    .setNotification(notification)
                    .build();

            FirebaseMessaging.getInstance().send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ----------------- Event Methods -----------------
    public void paymentConfirmed(Payment payment) {
        String msg = "💰 Payment successful! Subscription activated.";
        sendNotification(payment.getShopkeeper(), msg, "PAYMENT_SUCCESS");
        sendPushNotification(payment.getShopkeeper(), "Payment Success", msg);
        emailService.send(payment.getShopkeeper().getEmail(), "Payment Successful - LocalLoot", "Your subscription has been activated successfully.");
    }

    public void offerApproved(Offer offer) {
        String msg = "✅ Your offer has been APPROVED";
        sendNotification(offer.getShopkeeper(), msg, "OFFER_APPROVED");
        sendPushNotification(offer.getShopkeeper(), "Offer Approved", msg);
        emailService.send(offer.getShopkeeper().getEmail(), "Offer Approved - LocalLoot", "Congratulations! Your offer has been approved.");
    }

    public void offerRejected(Offer offer, String comment) {
        String msg = "❌ Your offer was rejected. " + (comment != null ? comment : "");
        sendNotification(offer.getShopkeeper(), msg, "OFFER_REJECTED");
        sendPushNotification(offer.getShopkeeper(), "Offer Rejected", msg);
        emailService.send(offer.getShopkeeper().getEmail(), "Offer Rejected - LocalLoot", msg);
    }

    public void subscriptionExpiring(Subscription subscription, long daysRemaining) {
        String msg = daysRemaining <= 0
                ? "⚠️ Your subscription has expired!"
                : "⚠️ Your subscription will expire in " + daysRemaining + " days.";
        sendNotification(subscription.getShopkeeper(), msg, "SUBSCRIPTION_EXPIRY");
        sendPushNotification(subscription.getShopkeeper(), "Subscription Expiry", msg);
        emailService.send(subscription.getShopkeeper().getEmail(), "Subscription Expiry - LocalLoot", msg);
    }
}