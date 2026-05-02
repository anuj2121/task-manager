package com.anuj.taskmanager.services;

import com.anuj.taskmanager.entity.User;
import com.anuj.taskmanager.repository.UserRepository;
import com.anuj.taskmanager.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // ✅ use bean

    @Autowired
    private JwtUtil jwtUtil;  // 🔥 add JWT

    // 🔹 Register
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // 🔹 Login (UPDATED 🔥)
    public String loginUser(String email, String password) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("EMAIL: " + email);
    System.out.println("RAW PASSWORD: [" + password + "]");
    System.out.println("DB PASSWORD: " + user.getPassword());

    boolean match = passwordEncoder.matches(password, user.getPassword());
    System.out.println("MATCH RESULT: " + match);

    if (!match) {
        throw new RuntimeException("Invalid password");
    }

    return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
}

    // 🔹 Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}