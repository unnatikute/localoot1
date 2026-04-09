package com.localoot.localoot.controller;

import com.localoot.localoot.model.Shop;
import com.localoot.localoot.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin("*")
public class ShopController {

    @Autowired
    private ShopRepository shopRepository;

    @PostMapping("/register")
    public String registerShop(@RequestBody Shop shop) {
        shop.setRegistrationStatus("PENDING");
        shop.setCreatedAt(LocalDateTime.now());
        shop.setRegistrationDate(LocalDateTime.now()); // ✅ ADD THIS
        shopRepository.save(shop);
        return "Shop Registered Successfully";
    }

   @GetMapping("/my-shop")
public ResponseEntity<?> getMyShop(@RequestParam Long shopkeeperId) {
    Shop shop = shopRepository.findByShopkeeperId(shopkeeperId);

    if (shop == null) {
        return ResponseEntity.ok(null); // avoid 500
    }

    return ResponseEntity.ok(shop);
}

@GetMapping
public ResponseEntity<?> getAllShops(@RequestParam(required = false) Integer limit) {
    List<Shop> shops = shopRepository.findAll();

    if (limit != null && limit > 0 && shops.size() > limit) {
        shops = shops.subList(0, limit);
    }

    return ResponseEntity.ok(shops);
}
}