package com.localoot.localoot.controller;

import com.localoot.localoot.model.User;
import com.localoot.localoot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows your frontend to connect
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public String registerUser(@RequestBody User user) {
        // Encrypting the password before saving to MySQL
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }
    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
    // 1. Find user by email
    User user = userRepository.findByEmail(loginRequest.getEmail());
    
    if (user != null) {
        // 2. Compare raw password with encrypted hash in DB
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Return the user object (excluding sensitive data is better, but this works for now)
            return ResponseEntity.ok(user); 
        } else {
            // Sends a 401 Unauthorized error to React
            return ResponseEntity.status(401).body("Invalid Password!");
        }
    }
    // Sends a 404 Not Found error to React
    return ResponseEntity.status(404).body("User not found!");
}
}
