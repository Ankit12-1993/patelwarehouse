package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Lead;
import com.warehouse.wms_backend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*") // Allow frontend to call APIs
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

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

    // Admin endpoint: Update lead status (e.g., APPROVE, REJECT)
    @PutMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(@PathVariable Long id, @RequestParam String status) {
        return leadRepository.findById(id).map(lead -> {
            lead.setStatus(status);
            return ResponseEntity.ok(leadRepository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }
}
