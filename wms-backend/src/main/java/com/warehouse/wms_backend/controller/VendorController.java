package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Vendor;
import com.warehouse.wms_backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Admin endpoint: Create a new vendor profile
    @PostMapping
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        // Validation/enrichment logic can go here
        return ResponseEntity.ok(vendorRepository.save(vendor));
    }
}
