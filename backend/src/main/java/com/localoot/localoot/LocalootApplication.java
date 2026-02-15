package com.localoot.localoot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Remove the (exclude = ...) part
public class LocalootApplication {
    public static void main(String[] args) {
        SpringApplication.run(LocalootApplication.class, args);
    }
}