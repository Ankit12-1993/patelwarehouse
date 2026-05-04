package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.config.JwtUtil;
import com.warehouse.wms_backend.entity.User;
import com.warehouse.wms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPasswordHash())) {
            User user = userOptional.get();
            String jwt = jwtUtil.generateToken(user.getEmail(), user.getRole());
            
            return ResponseEntity.ok(Map.of(
                "token", jwt,
                "email", user.getEmail(),
                "role", user.getRole()
            ));
        }

        return ResponseEntity.status(401).body("Error: Unauthorized. Invalid credentials.");
    }
}
