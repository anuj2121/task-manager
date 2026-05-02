package com.anuj.taskmanager.controller;

import com.anuj.taskmanager.dto.LoginRequest;
import com.anuj.taskmanager.entity.User;
import com.anuj.taskmanager.services.UserService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // 🔥 Login
   @PostMapping("/login")
public String login(@RequestBody LoginRequest req) {
    return userService.loginUser(req.getEmail(), req.getPassword());
}

    // ✅ Test
    @GetMapping("/test")
    public String test() {
        return "API working";
    }

    // 🔒 Only ADMIN can see users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}