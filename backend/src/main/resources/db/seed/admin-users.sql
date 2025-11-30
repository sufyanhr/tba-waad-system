-- ==============================
-- Admin Users Seeder
-- ==============================
-- Creates essential admin user accounts for TBA-WAAD system
-- All passwords are hashed using BCrypt ($2a$10$)
-- Default password for all accounts: "Admin@123"
-- ==============================

-- 1. SUPER_ADMIN user (System Administrator)
INSERT INTO users (id, username, email, full_name, password_hash, phone, is_active, created_at, updated_at)
VALUES
  (1, 'superadmin', 'superadmin@tba.sa', 'Super Administrator', 
   '$2a$10$8K1p/a0dL3.VQ3Y0Zbx2heoW7pEKnTf9AJELIGxN8K1hZ.j6x8c8u', 
   '+218910000001', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role)
VALUES
  (1, 'ADMIN')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. TBA_ADMIN user (TBA Operations Manager)
INSERT INTO users (id, username, email, full_name, password_hash, phone, is_active, created_at, updated_at)
VALUES
  (2, 'tba.admin', 'tba.admin@tba.sa', 'TBA Administrator', 
   '$2a$10$8K1p/a0dL3.VQ3Y0Zbx2heoW7pEKnTf9AJELIGxN8K1hZ.j6x8c8u', 
   '+218910000002', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role)
VALUES
  (2, 'TBA_OPERATIONS')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. INSURANCE_ADMIN user (Insurance Company Admin)
INSERT INTO users (id, username, email, full_name, password_hash, phone, is_active, created_at, updated_at)
VALUES
  (3, 'insurance.admin', 'insurance.admin@tba.sa', 'Insurance Administrator', 
   '$2a$10$8K1p/a0dL3.VQ3Y0Zbx2heoW7pEKnTf9AJELIGxN8K1hZ.j6x8c8u', 
   '+218910000003', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role)
VALUES
  (3, 'INSURANCE_ADMIN')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. EMPLOYER template user (Company Manager)
-- This is a template - create one per employer
-- Example for employer_id = 1
INSERT INTO users (id, username, email, full_name, password_hash, phone, employer_id, is_active, created_at, updated_at)
VALUES
  (4, 'employer.001', 'employer.001@tba.sa', 'Employer Manager (Company 001)', 
   '$2a$10$8K1p/a0dL3.VQ3Y0Zbx2heoW7pEKnTf9AJELIGxN8K1hZ.j6x8c8u', 
   '+218910000004', 1, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role)
VALUES
  (4, 'EMPLOYER')
ON CONFLICT (user_id, role) DO NOTHING;

-- Reset sequence for users table
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- ==============================
-- Usage Instructions:
-- ==============================
-- 1. All users have default password: Admin@123
-- 2. Password hash was generated using: BCryptPasswordEncoder(10).encode("Admin@123")
-- 3. For EMPLOYER users:
--    - Update employer_id to match actual employer record
--    - Update username/email with employer code (e.g., employer.COMPANY_CODE)
--    - One EMPLOYER user per company
-- 4. Users should change their passwords on first login
-- 5. To create additional employer users, duplicate the EMPLOYER block and:
--    - Change id (5, 6, 7, ...)
--    - Change username/email (employer.002, employer.003, ...)
--    - Change employer_id (2, 3, 4, ...)
--    - Change phone number
-- ==============================

-- ==============================
-- Testing Credentials:
-- ==============================
-- SUPER_ADMIN:
--   Email: superadmin@tba.sa
--   Password: Admin@123
--   Role: ADMIN
--   Access: Full system access, can see employer switcher
--
-- TBA_ADMIN:
--   Email: tba.admin@tba.sa
--   Password: Admin@123
--   Role: TBA_OPERATIONS
--   Access: TBA operations, can see employer switcher
--
-- INSURANCE_ADMIN:
--   Email: insurance.admin@tba.sa
--   Password: Admin@123
--   Role: INSURANCE_ADMIN
--   Access: Cross-employer view, NO employer switcher
--
-- EMPLOYER (Company 001):
--   Email: employer.001@tba.sa
--   Password: Admin@123
--   Role: EMPLOYER
--   Access: Auto-locked to employer_id=1, NO employer switcher
-- ==============================
