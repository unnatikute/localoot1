package com.localoot.localoot.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {

        System.out.println("🔥 Cloudinary Bean CREATED");

        return new Cloudinary(Map.of(
                "cloud_name", "dyekhgyhp",
                "api_key", "522485992315636",
                "api_secret", "WlYBnqMvl9cwPE6VeBQ6MBrjluQ"
        ));
    }
}