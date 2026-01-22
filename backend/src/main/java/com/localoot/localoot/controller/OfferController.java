package com.localoot.localoot.controller;

import com.localoot.localoot.model.Offer;
import com.localoot.localoot.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
// This allows your React app (running on port 5173) to talk to this backend
@CrossOrigin(origins = "http://localhost:5173")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    /**
     * 1. CREATE OFFER (Shopkeeper)
     * When a shopkeeper submits, it starts as 'PENDING'
     */
    @PostMapping("/create")
    public Offer createOffer(@RequestBody Offer offer) {
        offer.setStatus("PENDING");
        return offerRepository.save(offer);
    }

    /**
     * 2. GET ALL PENDING (Admin)
     * Admin uses this to see what needs approval
     */
    @GetMapping("/admin/pending")
    public List<Offer> getPendingOffers() {
        return offerRepository.findByStatus("PENDING");
    }

    /**
     * 3. APPROVE OFFER (Admin)
     * Changes status from PENDING to APPROVED
     */
    @PutMapping("/admin/approve/{id}")
    public Offer approveOffer(@PathVariable Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + id));
        offer.setStatus("APPROVED");
        return offerRepository.save(offer);
    }

    /**
     * 4. GET ACTIVE OFFERS (Customer)
     * Filters by Area, Category, and only shows APPROVED offers
     */
    @GetMapping("/active")
    public List<Offer> getActiveOffers(
            @RequestParam String area, 
            @RequestParam String category) {
        return offerRepository.findByStatusAndAreaAndCategory("APPROVED", area, category);
    }

    /**
     * 5. GET SHOPKEEPER'S OWN OFFERS
     * For the Shopkeeper Dashboard list
     */
    @GetMapping("/shopkeeper/{id}")
    public List<Offer> getShopkeeperOffers(@PathVariable Long id) {
        return offerRepository.findByShopkeeperId(id);
    }
}