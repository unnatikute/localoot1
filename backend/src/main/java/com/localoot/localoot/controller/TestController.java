package com.localoot.localoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.localoot.localoot.service.EmailService;

@RestController
public class TestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/test-mail")
    public String testMail() {
        emailService.send(
            "unnatikute777@gmail.com",
            "Test Subject",
            "Test Body"
        );
        return "Mail sent successfully!";
    }
}