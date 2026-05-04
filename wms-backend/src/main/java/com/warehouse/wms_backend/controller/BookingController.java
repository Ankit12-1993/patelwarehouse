package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Booking;
import com.warehouse.wms_backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // Admin/Vendor endpoint: Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // Admin endpoint: Create a new booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        booking.setStatus("PENDING");
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    // Admin endpoint: Approve booking and allocate slot
    @PutMapping("/{id}/allocate")
    public ResponseEntity<Booking> allocateSlot(@PathVariable Long id, @RequestParam Long slotId) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setSlotId(slotId);
            booking.setStatus("ACTIVE");
            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoint: Update booking status directly
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(status);
            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }
}
