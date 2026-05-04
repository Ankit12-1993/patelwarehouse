-- V3__add_lead_audit_fields.sql

ALTER TABLE leads ADD COLUMN updated_at TIMESTAMP;
ALTER TABLE leads ADD COLUMN updated_by VARCHAR(255);
