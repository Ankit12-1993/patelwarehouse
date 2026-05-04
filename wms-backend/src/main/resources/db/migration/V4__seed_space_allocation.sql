-- V4__seed_space_allocation.sql

-- 1. Add pricing column to slots
ALTER TABLE slots ADD COLUMN monthly_price NUMERIC;

-- 2. Clear existing test data
DELETE FROM invoices;
DELETE FROM bookings;
DELETE FROM vendors;
DELETE FROM leads;
DELETE FROM slots;
DELETE FROM zones;
DELETE FROM warehouses;

-- 3. Create Sample Warehouse
INSERT INTO warehouses (id, name, location, total_area_sqft) VALUES (1, 'Main Hub', 'Delhi', 50000);
SELECT setval('warehouses_id_seq', 1);

-- 4. Create 3 Zones (A, B, C)
INSERT INTO zones (id, warehouse_id, name, type) VALUES 
(1, 1, 'Zone A', 'GENERAL'),
(2, 1, 'Zone B', 'GENERAL'),
(3, 1, 'Zone C', 'COLD_STORAGE');
SELECT setval('zones_id_seq', 3);

-- 5. Create 15 Slots (5 per zone) with fixed size and monthly price
-- Zone A
INSERT INTO slots (id, zone_id, name, area_sqft, status, monthly_price) VALUES 
(1, 1, 'A1', 500, 'AVAILABLE', 25000),
(2, 1, 'A2', 500, 'OCCUPIED', 25000),
(3, 1, 'A3', 1000, 'AVAILABLE', 45000),
(4, 1, 'A4', 1000, 'AVAILABLE', 45000),
(5, 1, 'A5', 2000, 'AVAILABLE', 80000);

-- Zone B
INSERT INTO slots (id, zone_id, name, area_sqft, status, monthly_price) VALUES 
(6, 2, 'B1', 500, 'OCCUPIED', 25000),
(7, 2, 'B2', 500, 'AVAILABLE', 25000),
(8, 2, 'B3', 1000, 'AVAILABLE', 45000),
(9, 2, 'B4', 1000, 'AVAILABLE', 45000),
(10, 2, 'B5', 2000, 'AVAILABLE', 80000);

-- Zone C
INSERT INTO slots (id, zone_id, name, area_sqft, status, monthly_price) VALUES 
(11, 3, 'C1', 500, 'AVAILABLE', 30000),
(12, 3, 'C2', 500, 'AVAILABLE', 30000),
(13, 3, 'C3', 1000, 'AVAILABLE', 55000),
(14, 3, 'C4', 1000, 'AVAILABLE', 55000),
(15, 3, 'C5', 2000, 'AVAILABLE', 100000);

SELECT setval('slots_id_seq', 15);

-- 6. Create Sample Vendors
INSERT INTO vendors (id, company_name, contact_name, phone) VALUES 
(1, 'Snapdeal', 'Snapdeal Contact', '+91 90000 00001'),
(2, 'Meesho', 'Meesho Contact', '+91 90000 00002');
SELECT setval('vendors_id_seq', 2);

-- 7. Create Sample Bookings for Snapdeal (A2) and Meesho (B1)
INSERT INTO bookings (id, vendor_id, slot_id, start_date, status) VALUES 
(1, 1, 2, CURRENT_DATE, 'ACTIVE'),
(2, 2, 6, CURRENT_DATE, 'ACTIVE');
SELECT setval('bookings_id_seq', 2);
