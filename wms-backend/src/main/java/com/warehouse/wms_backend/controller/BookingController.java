package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Booking;
import com.warehouse.wms_backend.repository.BookingRepository;
import com.warehouse.wms_backend.entity.User;
import com.warehouse.wms_backend.entity.Vendor;
import com.warehouse.wms_backend.repository.UserRepository;
import com.warehouse.wms_backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    // Admin endpoint: Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // Vendor endpoint: Get my bookings
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Principal principal) {
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isPresent()) {
            Optional<Vendor> vendorOpt = vendorRepository.findByUserId(userOpt.get().getId());
            if (vendorOpt.isPresent()) {
                return ResponseEntity.ok(bookingRepository.findByVendorId(vendorOpt.get().getId()));
            }
        }
        return ResponseEntity.notFound().build();
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
