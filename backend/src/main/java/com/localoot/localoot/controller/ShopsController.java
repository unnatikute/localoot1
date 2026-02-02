package com.localoot.localoot.controller;

import com.localoot.localoot.model.Shop;
import com.localoot.localoot.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Public API for browsing shops. Used by ShopGrid, ShopDetail, etc.
 * Only returns APPROVED shops.
 */
@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "*")
public class ShopsController {

    @Autowired
    private ShopRepository shopRepository;

    /**
     * List approved shops (for ShopGrid, Categories, etc.)
     */
    @GetMapping
    public ResponseEntity<?> getShops(@RequestParam(required = false) Integer limit) {
        List<Shop> shops = shopRepository.findByRegistrationStatus("APPROVED");
        if (limit != null && limit > 0 && shops.size() > limit) {
            shops = shops.subList(0, limit);
        }
        return ResponseEntity.ok(shops);
    }

    /**
     * Get shop details by ID (only approved shops)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getShopById(@PathVariable Long id) {
        Optional<Shop> opt = shopRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Shop shop = opt.get();
        if (!"APPROVED".equalsIgnoreCase(shop.getRegistrationStatus())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(shop);
    }
}
