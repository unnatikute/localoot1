package com.localoot.localoot.repository;

import com.localoot.localoot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This allows us to check if an email already exists
    User findByEmail(String email);
}