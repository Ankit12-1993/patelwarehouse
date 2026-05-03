package com.warehouse.wms_backend.repository;

import com.warehouse.wms_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByVendorId(Long vendorId);
    List<Booking> findByStatus(String status);
}
