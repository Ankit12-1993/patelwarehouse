package com.warehouse.wms_backend.repository;

import com.warehouse.wms_backend.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByZoneId(Long zoneId);
    List<Slot> findByStatus(String status);
}
