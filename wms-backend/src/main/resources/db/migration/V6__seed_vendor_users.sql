-- V6__seed_vendor_users.sql

-- Create users using the exact same password hash as the admin
INSERT INTO users (email, password_hash, role) 
SELECT 'snapdeal@vendor.com', password_hash, 'VENDOR' FROM users WHERE role='ADMIN' LIMIT 1;

INSERT INTO users (email, password_hash, role) 
SELECT 'meesho@vendor.com', password_hash, 'VENDOR' FROM users WHERE role='ADMIN' LIMIT 1;

-- Update vendors to link to these users
UPDATE vendors SET user_id = (SELECT id FROM users WHERE email='snapdeal@vendor.com') WHERE company_name='Snapdeal';
UPDATE vendors SET user_id = (SELECT id FROM users WHERE email='meesho@vendor.com') WHERE company_name='Meesho';
