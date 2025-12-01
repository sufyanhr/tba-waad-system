-- ===================================================================
-- TBA-Waad System - Primary Tenant Company Initialization
-- ===================================================================
-- This script creates the primary tenant company record for the
-- TBA-Waad system. This is the main company that manages all
-- insurance operations.
--
-- Company Details:
--   - Name: شركة وعد لإدارة النفقات الطبية (Waad Medical Expense Management Company)
--   - Code: waad
--   - Active: true
--
-- Expected company_id: 1 (if this is the first company in the system)
-- ===================================================================

-- Check if company already exists
DO $$
DECLARE
    company_exists BOOLEAN;
    company_record RECORD;
BEGIN
    -- Check if company with code 'waad' exists
    SELECT EXISTS(SELECT 1 FROM companies WHERE code = 'waad') INTO company_exists;
    
    IF company_exists THEN
        -- Company already exists, show details
        SELECT * INTO company_record FROM companies WHERE code = 'waad';
        RAISE NOTICE '✅ Primary tenant company already exists!';
        RAISE NOTICE '   Company ID: %', company_record.id;
        RAISE NOTICE '   Company Code: %', company_record.code;
        RAISE NOTICE '   Company Name: %', company_record.name;
        RAISE NOTICE '   Active: %', company_record.active;
        RAISE NOTICE '   Created At: %', company_record.created_at;
    ELSE
        -- Create the company
        INSERT INTO companies (name, code, active, created_at, updated_at)
        VALUES (
            'شركة وعد لإدارة النفقات الطبية',
            'waad',
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING * INTO company_record;
        
        RAISE NOTICE '====================================================';
        RAISE NOTICE '✅ Primary tenant company created successfully!';
        RAISE NOTICE '====================================================';
        RAISE NOTICE '   Company ID: %', company_record.id;
        RAISE NOTICE '   Company Code: %', company_record.code;
        RAISE NOTICE '   Company Name: %', company_record.name;
        RAISE NOTICE '   Active: %', company_record.active;
        RAISE NOTICE '   Created At: %', company_record.created_at;
        RAISE NOTICE '====================================================';
    END IF;
END $$;

-- Display all companies in the system
SELECT 
    id as "Company ID",
    code as "Code",
    name as "Name",
    active as "Active",
    created_at as "Created At"
FROM companies
ORDER BY id;
