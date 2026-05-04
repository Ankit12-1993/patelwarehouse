package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Lead;
import com.warehouse.wms_backend.entity.Vendor;
import com.warehouse.wms_backend.entity.Booking;
import com.warehouse.wms_backend.repository.LeadRepository;
import com.warehouse.wms_backend.repository.VendorRepository;
import com.warehouse.wms_backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : "System";
    }

    // Public endpoint: Submit a new lead from the website
    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        lead.setStatus("NEW");
        Lead savedLead = leadRepository.save(lead);
        return ResponseEntity.ok(savedLead);
    }

    // Admin endpoint: View all leads
    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadRepository.findAll());
    }

    // Admin endpoint: Update lead status
    @PutMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(@PathVariable Long id, @RequestParam String status) {
        return leadRepository.findById(id).map(lead -> {
            lead.setStatus(status);
            lead.setUpdatedAt(LocalDateTime.now());
            lead.setUpdatedBy(getCurrentUser());
            return ResponseEntity.ok(leadRepository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoint: Update lead notes
    @PutMapping("/{id}/notes")
    public ResponseEntity<Lead> updateLeadNotes(@PathVariable Long id, @RequestBody String notes) {
        return leadRepository.findById(id).map(lead -> {
            lead.setNotes(notes);
            lead.setUpdatedAt(LocalDateTime.now());
            lead.setUpdatedBy(getCurrentUser());
            return ResponseEntity.ok(leadRepository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoint: Convert lead to booking
    @PostMapping("/{id}/convert")
    public ResponseEntity<?> convertLeadToBooking(@PathVariable Long id) {
        return leadRepository.findById(id).map(lead -> {
            if ("CLOSED".equals(lead.getStatus())) {
                return ResponseEntity.badRequest().body("Lead is already converted.");
            }

            // 1. Create Vendor
            Vendor vendor = new Vendor();
            vendor.setCompanyName(lead.getCompanyName());
            vendor.setContactName("Contact from Lead: " + lead.getEmail());
            vendor.setPhone(lead.getPhone());
            Vendor savedVendor = vendorRepository.save(vendor);

            // 2. Create Booking
            Booking booking = new Booking();
            booking.setVendorId(savedVendor.getId());
            booking.setStartDate(LocalDate.now());
            booking.setStatus("PENDING");
            bookingRepository.save(booking);

            // 3. Update Lead Status
            lead.setStatus("CLOSED");
            lead.setUpdatedAt(LocalDateTime.now());
            lead.setUpdatedBy(getCurrentUser());
            leadRepository.save(lead);

            return ResponseEntity.ok(savedVendor);
        }).orElse(ResponseEntity.notFound().build());
    }
}
