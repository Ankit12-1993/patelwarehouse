package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Vendor;
import com.warehouse.wms_backend.repository.VendorRepository;
import com.warehouse.wms_backend.entity.User;
import com.warehouse.wms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorRepository vendorRepository;

    // Admin endpoint: Get all vendors
    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    // Vendor endpoint: Get my profile
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<Vendor> getMyProfile(Principal principal) {
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isPresent()) {
            Optional<Vendor> vendorOpt = vendorRepository.findByUserId(userOpt.get().getId());
            if (vendorOpt.isPresent()) {
                return ResponseEntity.ok(vendorOpt.get());
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Admin endpoint: Create a new vendor profile
    @PostMapping
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        // Validation/enrichment logic can go here
        return ResponseEntity.ok(vendorRepository.save(vendor));
    }
}
