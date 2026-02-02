package com.localoot.localoot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.localoot.localoot.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This allows us to check if an email already exists
    User findByEmail(String email);
    List<User> findByRole(String role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") String role);
}