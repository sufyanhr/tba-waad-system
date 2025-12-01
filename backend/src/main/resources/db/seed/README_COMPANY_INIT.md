# Primary Tenant Company Initialization

## Overview
This module initializes the primary tenant company (شركة وعد لإدارة النفقات الطبية) for the TBA-Waad system.

## Company Details
- **Name (Arabic):** شركة وعد لإدارة النفقات الطبية
- **Name (English):** Waad Medical Expense Management Company  
- **Code:** `waad`
- **Status:** Active
- **Expected ID:** 1 (if first company)

## Initialization Methods

### Method 1: Automatic Initialization (Recommended)
The company is created automatically when the application starts via `DataInitializer`.

**How it works:**
1. Application starts
2. `DataInitializer` runs
3. Calls `SystemAdminService.initDefaults()`
4. Creates company if not exists
5. Logs company details to console

**Verification:**
Check application logs on startup for:
```
✅ Primary tenant company created successfully!
   Company ID: 1
   Company Code: waad
   Company Name: شركة وعد لإدارة النفقات الطبية
```

### Method 2: REST API Endpoint
Use the admin endpoint to manually trigger initialization:

**Endpoint:**
```http
POST /api/admin/system/init-defaults
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Defaults initialized",
  "data": null,
  "timestamp": "2025-12-01T10:00:00Z"
}
```

**Prerequisites:**
- User must have `system.manage` permission
- Must be authenticated with admin role

### Method 3: Direct SQL Execution
Execute the provided SQL script directly in PostgreSQL:

```bash
psql -U postgres -d tba_waad -f src/main/resources/db/seed/01-init-primary-company.sql
```

**Script Location:**
`backend/src/main/resources/db/seed/01-init-primary-company.sql`

## Verification

### Check via API
```http
GET /api/companies
GET /api/companies/code/waad
```

### Check via SQL
```sql
SELECT * FROM companies WHERE code = 'waad';
```

### Expected Result
```
id | code | name                                  | active | created_at          | updated_at
---+------+---------------------------------------+--------+---------------------+-------------
 1 | waad | شركة وعد لإدارة النفقات الطبية      | true   | 2025-12-01 10:00:00 | 2025-12-01 10:00:00
```

## Idempotency
All initialization methods are **idempotent**:
- If company exists → Returns existing company (no duplicates)
- If company doesn't exist → Creates new company
- Safe to run multiple times

## Integration with Multi-Tenant System

### How company_id is Used
1. **Employers:** Each employer has `company_id = 1` (Waad)
2. **Members:** Inherit `company_id` from employer
3. **Claims:** Filtered by `company_id` from JWT
4. **Policies:** Associated with employer → company
5. **Pre-Approvals:** Include `company_id` for tenant isolation

### Company Switching
Users with access to multiple companies:
```json
{
  "userId": 123,
  "selectedCompanyId": 1,
  "availableCompanies": [1, 2, 3]
}
```

### Data Isolation
All tenant-scoped queries automatically filter by company:
```java
WHERE company_id = :selectedCompanyId
```

## Troubleshooting

### Issue: Company not created
**Solution:**
1. Check database connectivity
2. Verify `companies` table exists
3. Check application logs for errors
4. Manually run SQL script

### Issue: Duplicate company error
**Cause:** Company with code 'waad' already exists  
**Solution:** This is expected! The company is already initialized.

### Issue: Permission denied
**Cause:** User lacks `system.manage` permission  
**Solution:** Grant permission via RBAC or use admin user

## Files Reference

### Backend Files
- `SystemAdminService.java` - Service with `ensurePrimaryTenantCompany()` method
- `DataInitializer.java` - CommandLineRunner for auto-initialization
- `SystemAdminController.java` - REST endpoint `/api/admin/system/init-defaults`
- `Company.java` - Entity definition
- `CompanyRepository.java` - Data access layer

### SQL Files
- `01-init-primary-company.sql` - Direct database initialization script

## Next Steps
After company initialization:
1. Create employers under this company
2. Enroll members with `company_id = 1`
3. Configure policies and benefits
4. Set up provider network
5. Begin processing claims

## Support
For issues or questions, contact the development team or refer to:
- Architecture documentation: `TBA_ARCHITECTURE_MASTER_BLUEPRINT.md`
- API documentation: Swagger UI at `/swagger-ui.html`
