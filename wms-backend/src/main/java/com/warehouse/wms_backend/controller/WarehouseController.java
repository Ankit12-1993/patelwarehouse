package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Slot;
import com.warehouse.wms_backend.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse/slots")
@CrossOrigin(origins = "*")
public class WarehouseController {

    @Autowired
    private SlotRepository slotRepository;

    // Admin/Vendor endpoint: Get all slots to check availability
    @GetMapping
    public ResponseEntity<List<Slot>> getAllSlots(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(slotRepository.findByStatus(status));
        }
        return ResponseEntity.ok(slotRepository.findAll());
    }

    // Admin endpoint: Update slot status (e.g., OCCUPIED)
    @PutMapping("/{id}/status")
    public ResponseEntity<Slot> updateSlotStatus(@PathVariable Long id, @RequestParam String status) {
        return slotRepository.findById(id).map(slot -> {
            slot.setStatus(status);
            return ResponseEntity.ok(slotRepository.save(slot));
        }).orElse(ResponseEntity.notFound().build());
    }
}
