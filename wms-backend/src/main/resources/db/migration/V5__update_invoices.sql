-- V5__update_invoices.sql

-- 1. Alter invoices table
ALTER TABLE invoices RENAME COLUMN billing_month TO month;
ALTER TABLE invoices ADD COLUMN year VARCHAR(4);
ALTER TABLE invoices ADD COLUMN payment_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN payment_mode VARCHAR(50);

-- Update default status
ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'PENDING';

-- In postgres, to change the default of an existing column, we do the above. 
-- However, we should also update any existing rows just in case (though there shouldn't be any).
UPDATE invoices SET status = 'PENDING' WHERE status = 'UNPAID';

-- 2. Delete any existing invoices just in case
DELETE FROM invoices;

-- 3. Seed Sample Invoices
-- Snapdeal -> Booking 1 (Vendor 1, Slot 2) -> May 2026 -> 2000 -> PENDING
-- Meesho -> Booking 2 (Vendor 2, Slot 6) -> May 2026 -> 2000 -> PAID
INSERT INTO invoices (vendor_id, booking_id, amount, month, year, status, payment_date, payment_mode) VALUES 
(1, 1, 2000, 'May', '2026', 'PENDING', NULL, NULL),
(2, 2, 2000, 'May', '2026', 'PAID', CURRENT_TIMESTAMP, 'Bank Transfer');
