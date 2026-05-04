package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Slot;
import com.warehouse.wms_backend.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    // Admin endpoint: Get all slots (optionally filter by status)
    @GetMapping
    public ResponseEntity<List<Slot>> getAllSlots(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            // Note: If finding by status is needed frequently, we should add findByStatus in SlotRepository
            List<Slot> filtered = slotRepository.findAll().stream()
                .filter(slot -> status.equals(slot.getStatus()))
                .toList();
            return ResponseEntity.ok(filtered);
        }
        return ResponseEntity.ok(slotRepository.findAll());
    }

    // Admin endpoint: Mark slot as OCCUPIED
    @PutMapping("/{id}/allocate")
    public ResponseEntity<Slot> allocateSlot(@PathVariable Long id) {
        return slotRepository.findById(id).map(slot -> {
            slot.setStatus("OCCUPIED");
            return ResponseEntity.ok(slotRepository.save(slot));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoint: Mark slot as FREE/AVAILABLE
    @PutMapping("/{id}/release")
    public ResponseEntity<Slot> releaseSlot(@PathVariable Long id) {
        return slotRepository.findById(id).map(slot -> {
            slot.setStatus("AVAILABLE");
            return ResponseEntity.ok(slotRepository.save(slot));
        }).orElse(ResponseEntity.notFound().build());
    }
}
