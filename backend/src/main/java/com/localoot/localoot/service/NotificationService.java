package com.localoot.localoot.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.localoot.localoot.model.Offer;
import com.localoot.localoot.model.Payment;
import com.localoot.localoot.model.Subscription;
import com.localoot.localoot.model.User;

@Service
public class NotificationService {
    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void offerApproved(Offer offer) {
        User shopkeeper = offer.getShopkeeper();
        if (shopkeeper == null) return;
        emailService.send(
                shopkeeper.getEmail(),
                "Your offer was approved",
                "Hi " + safe(shopkeeper.getName()) + ",\n\n"
                        + "Good news! Your offer has been approved and is now visible to users.\n\n"
                        + "Offer: " + safe(offer.getTitle()) + "\n"
                        + "Shop: " + safe(offer.getShopName()) + "\n"
                        + "Area: " + safe(offer.getArea()) + "\n\n"
                        + "Thanks,\nLocalLoot Team");
    }

    public void offerRejected(Offer offer, String comment) {
        User shopkeeper = offer.getShopkeeper();
        if (shopkeeper == null) return;
        emailService.send(
                shopkeeper.getEmail(),
                "Your offer was rejected",
                "Hi " + safe(shopkeeper.getName()) + ",\n\n"
                        + "Your offer was rejected by the admin.\n\n"
                        + "Offer: " + safe(offer.getTitle()) + "\n"
                        + "Reason: " + safe(comment) + "\n\n"
                        + "You can edit and resubmit with corrections.\n\n"
                        + "Thanks,\nLocalLoot Team");
    }

    public void paymentConfirmed(Payment payment) {
        if (payment.getShopkeeper() == null) return;
        emailService.send(
                payment.getShopkeeper().getEmail(),
                "Payment confirmed - " + safe(payment.getInvoiceNumber()),
                "Hi " + safe(payment.getShopkeeper().getName()) + ",\n\n"
                        + "Your payment is confirmed.\n\n"
                        + "Invoice: " + safe(payment.getInvoiceNumber()) + "\n"
                        + "Amount: ₹" + payment.getAmount() + "\n"
                        + "Package: " + (payment.getSubscriptionPackage() != null ? safe(payment.getSubscriptionPackage().getName()) : "N/A") + "\n\n"
                        + "Thanks,\nLocalLoot Team");
    }

    public void subscriptionExpiring(Subscription subscription, long daysRemaining) {
        if (subscription.getShopkeeper() == null) return;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
        emailService.send(
                subscription.getShopkeeper().getEmail(),
                "Subscription expiring in " + daysRemaining + " day(s)",
                "Hi " + safe(subscription.getShopkeeper().getName()) + ",\n\n"
                        + "Your subscription is expiring soon.\n\n"
                        + "Package: " + (subscription.getSubscriptionPackage() != null ? safe(subscription.getSubscriptionPackage().getName()) : "N/A") + "\n"
                        + "Expires on: " + (subscription.getEndDate() != null ? subscription.getEndDate().format(fmt) : "N/A") + "\n"
                        + "Days remaining: " + daysRemaining + "\n\n"
                        + "Renew now to avoid interruption.\n\n"
                        + "Thanks,\nLocalLoot Team");
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }
}

