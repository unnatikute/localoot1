package com.localoot.localoot.repository;

import com.localoot.localoot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // This removes the red line in UserController
    User findByEmail(String email);

    // This removes the red lines in AdminController statistics
    long countByRole(String role);

    // This allows the Admin to filter users by role
    List<User> findByRole(String role);
}