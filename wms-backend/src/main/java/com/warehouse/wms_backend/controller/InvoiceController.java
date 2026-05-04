package com.warehouse.wms_backend.controller;

import com.warehouse.wms_backend.entity.Invoice;
import com.warehouse.wms_backend.repository.InvoiceRepository;
import com.warehouse.wms_backend.entity.User;
import com.warehouse.wms_backend.entity.Vendor;
import com.warehouse.wms_backend.repository.UserRepository;
import com.warehouse.wms_backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Invoice>> getMyInvoices(Principal principal) {
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isPresent()) {
            Optional<Vendor> vendorOpt = vendorRepository.findByUserId(userOpt.get().getId());
            if (vendorOpt.isPresent()) {
                return ResponseEntity.ok(invoiceRepository.findByVendorId(vendorOpt.get().getId()));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Invoice> markAsPaid(@PathVariable Long id, @RequestParam String paymentMode) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus("PAID");
            invoice.setPaymentDate(LocalDateTime.now());
            invoice.setPaymentMode(paymentMode);
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }
}
