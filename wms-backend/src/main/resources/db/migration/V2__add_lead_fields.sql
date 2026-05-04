-- Add duration and notes columns to leads
ALTER TABLE leads ADD COLUMN duration VARCHAR(100);
ALTER TABLE leads ADD COLUMN notes TEXT;

-- Insert Master Admin User
-- Password is "password123" (BCrypt hashed)
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@patelwarehouse.in', '$2a$10$Yk20g2B70QxW69lP9W3tB.rQO3m4y5T0A.Ff66Ff38.D32Zf.v5h2', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
