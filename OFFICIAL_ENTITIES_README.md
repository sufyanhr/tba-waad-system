# 🏢 TBA-WAAD System - Official Organizational Structure

## 📋 Overview

This document defines the **OFFICIAL** organizational entities for the TBA-WAAD System. These are the **ONLY** authorized entities that should be used across the entire system.

> ⚠️ **IMPORTANT:** Do NOT create any demo, test, or temporary entities. Always use these official entities for all development, testing, and production scenarios.

---

## 🏛️ Organizational Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                   TBA-WAAD SYSTEM HIERARCHY                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ├─ Insurance Company
                                 │  └─ شركة الواحة للتأمين (ALWAHA_INS)
                                 │
                                 ├─ TPA (Third Party Administrator)
                                 │  └─ شركة وعد (WAAD_TPA)
                                 │
                                 └─ Employers (4 entities)
                                    ├─ شركة الإسمنت الليبية (LIBCEMENT)
                                    ├─ منطقة جليانة (JALYANA)
                                    ├─ مصرف الوحدة (WAHDA_BANK)
                                    └─ مصلحة الجمارك (CUSTOMS)
```

---

## 🏢 Entity Definitions

### 1️⃣ Primary Insurance Company

**شركة الواحة للتأمين** (Al Waha Insurance Company)

```javascript
{
  name: "شركة الواحة للتأمين",
  nameEn: "Al Waha Insurance Company",
  code: "ALWAHA_INS",
  type: "INSURANCE",
  licenseNumber: "LIC-ALWAHA-2024"
}
```

**Role:** Primary insurance provider covering all employers and members in the system.

---

### 2️⃣ TPA (Third Party Administrator)

**شركة وعد لإدارة مطالبات التأمين الصحي** (WAAD TPA)

```javascript
{
  name: "شركة وعد لإدارة مطالبات التأمين الصحي",
  nameEn: "WAAD TPA",
  code: "WAAD_TPA",
  type: "TPA"
}
```

**Role:** Main company operating the TBA system, managing claims and pre-authorizations on behalf of Al Waha Insurance.

---

### 3️⃣ Employers (4 Entities)

All employers are managed by WAAD TPA under Al Waha Insurance Company.

#### a) شركة الإسمنت الليبية (Libyan Cement Company)

```javascript
{
  label: "شركة الإسمنت الليبية",
  labelEn: "Libyan Cement Company",
  code: "LIBCEMENT",
  contactName: "أحمد محمود",
  phone: "+218912345001",
  email: "info@libcement.ly"
}
```

**Sector:** Manufacturing (Cement Production)

---

#### b) منطقة جليانة (Jalyana Region)

```javascript
{
  label: "منطقة جليانة",
  labelEn: "Jalyana Region",
  code: "JALYANA",
  contactName: "فاطمة عبدالله",
  phone: "+218912345002",
  email: "info@jalyana.ly"
}
```

**Sector:** Government/Regional Administration

---

#### c) مصرف الوحدة (Wahda Bank)

```javascript
{
  label: "مصرف الوحدة",
  labelEn: "Wahda Bank",
  code: "WAHDA_BANK",
  contactName: "محمد الطاهر",
  phone: "+218912345003",
  email: "info@wahdabank.ly"
}
```

**Sector:** Banking/Financial Services

---

#### d) مصلحة الجمارك (Customs Authority)

```javascript
{
  label: "مصلحة الجمارك",
  labelEn: "Customs Authority",
  code: "CUSTOMS",
  contactName: "سعيد أحمد",
  phone: "+218912345004",
  email: "info@customs.ly"
}
```

**Sector:** Government/Customs

---

## 📦 Frontend Constants

Add this file to your React project:

**Path:** `/frontend/src/constants/companies.js`

```javascript
/**
 * Official Organizational Structure for TBA-WAAD System
 * DO NOT modify or create temporary entities
 */

// Primary Insurance Company
export const INSURANCE_COMPANY = {
  name: "شركة الواحة للتأمين",
  nameEn: "Al Waha Insurance Company",
  code: "ALWAHA_INS",
  type: "INSURANCE"
};

// TPA (Third Party Administrator)
export const TPA_COMPANY = {
  name: "شركة وعد لإدارة مطالبات التأمين الصحي",
  nameEn: "WAAD TPA",
  code: "WAAD_TPA",
  type: "TPA"
};

// Employers
export const EMPLOYERS = [
  {
    label: "شركة الإسمنت الليبية",
    labelEn: "Libyan Cement Company",
    value: "LIBCEMENT",
    code: "LIBCEMENT"
  },
  {
    label: "منطقة جليانة",
    labelEn: "Jalyana Region",
    value: "JALYANA",
    code: "JALYANA"
  },
  {
    label: "مصرف الوحدة",
    labelEn: "Wahda Bank",
    value: "WAHDA_BANK",
    code: "WAHDA_BANK"
  },
  {
    label: "مصلحة الجمارك",
    labelEn: "Customs Authority",
    value: "CUSTOMS",
    code: "CUSTOMS"
  }
];

// Helper Functions
export const getEmployerByCode = (code) => {
  return EMPLOYERS.find(emp => emp.code === code);
};

export const getEmployerCodes = () => {
  return EMPLOYERS.map(emp => emp.code);
};

export default {
  insuranceCompany: INSURANCE_COMPANY,
  tpaCompany: TPA_COMPANY,
  employers: EMPLOYERS
};
```

---

## 🚀 Setup Instructions

### Automated Setup

Use the provided setup script to initialize all official entities:

```bash
cd backend
chmod +x setup-official-data.sh
./setup-official-data.sh
```

**Output:**
```
✓ Al Waha Insurance created (ID: X)
✓ Libyan Cement Company created (ID: X)
✓ Jalyana Region created (ID: X)
✓ Wahda Bank created (ID: X)
✓ Customs Authority created (ID: X)
```

### Manual Setup

If you need to create entities manually via API:

1. **Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin@tba.sa", "password": "Admin@123"}'
```

2. **Create Insurance Company:**
```bash
curl -X POST http://localhost:8080/api/insurance-companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "شركة الواحة للتأمين",
    "nameEn": "Al Waha Insurance Company",
    "code": "ALWAHA_INS",
    "licenseNumber": "LIC-ALWAHA-2024",
    "active": true
  }'
```

3. **Create Employers:**
```bash
# Repeat for each employer with their respective data
curl -X POST http://localhost:8080/api/employers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "شركة الإسمنت الليبية",
    "nameEn": "Libyan Cement Company",
    "code": "LIBCEMENT",
    "companyId": COMPANY_ID_FROM_STEP_2,
    "active": true
  }'
```

---

## 🔒 Usage Rules

### ✅ DO:
- Use these entities in all modules (Members, Providers, Policies, etc.)
- Reference these entities in PreAuth and Claims workflows
- Use these codes in RBAC scoping
- Include these in all E2E test scenarios
- Display these in UI dropdowns and selectors

### ❌ DO NOT:
- Create demo or test companies (e.g., "Test Company", "Demo Corp")
- Create temporary entities for development
- Hardcode different entity names in code
- Use made-up company codes
- Create duplicate entities with similar names

---

## 📁 Files Using Official Entities

### Backend
- ✅ `/backend/setup-official-data.sh` - Automated setup script
- ✅ `/backend/test-employers-crud.sh` - Uses LIBCEMENT and ALWAHA_INS
- ⏳ `/backend/test-members-crud.sh` - Update to use official entities
- ⏳ Service layer tests - Update all tests

### Frontend
- ✅ `/frontend/src/constants/companies.js` - Official constants
- ⏳ `/frontend/src/pages/tba/employers/EmployersList.jsx` - Update filters
- ⏳ `/frontend/src/pages/tba/members/MembersList.jsx` - Update dropdowns
- ⏳ All forms and selectors - Use official entities

---

## 🧪 Testing with Official Entities

### Example: Create Member

```javascript
const newMember = {
  fullName: "أحمد محمد",
  civilId: "29912345678",
  policyNumber: "POL-2024-001",
  email: "ahmed@example.com",
  phone: "+218912345678",
  dateOfBirth: "1999-01-15",
  gender: "MALE",
  employerId: LIBCEMENT_ID,  // Use official employer ID
  companyId: ALWAHA_INS_ID,  // Use official insurance company ID
  active: true
};
```

### Example: Create Claim

```javascript
const newClaim = {
  memberId: MEMBER_ID,
  providerId: PROVIDER_ID,
  employerId: LIBCEMENT_ID,    // Official employer
  insuranceCompanyId: ALWAHA_INS_ID,  // Official insurance
  claimDate: "2025-11-26",
  amount: 500.00,
  status: "PENDING"
};
```

---

## 📊 Database Schema

### insurance_companies
```sql
INSERT INTO insurance_companies (name, name_en, code, license_number, active)
VALUES ('شركة الواحة للتأمين', 'Al Waha Insurance Company', 'ALWAHA_INS', 'LIC-ALWAHA-2024', true);
```

### employers
```sql
INSERT INTO employers (name, name_en, code, company_id, contact_name, phone, email, active)
VALUES 
  ('شركة الإسمنت الليبية', 'Libyan Cement Company', 'LIBCEMENT', [COMPANY_ID], 'أحمد محمود', '+218912345001', 'info@libcement.ly', true),
  ('منطقة جليانة', 'Jalyana Region', 'JALYANA', [COMPANY_ID], 'فاطمة عبدالله', '+218912345002', 'info@jalyana.ly', true),
  ('مصرف الوحدة', 'Wahda Bank', 'WAHDA_BANK', [COMPANY_ID], 'محمد الطاهر', '+218912345003', 'info@wahdabank.ly', true),
  ('مصلحة الجمارك', 'Customs Authority', 'CUSTOMS', [COMPANY_ID], 'سعيد أحمد', '+218912345004', 'info@customs.ly', true);
```

---

## 🔄 Data Migration

If you have existing test/demo data, run this cleanup script:

```sql
-- Delete all test/demo entities
DELETE FROM members WHERE company_id NOT IN (SELECT id FROM insurance_companies WHERE code = 'ALWAHA_INS');
DELETE FROM employers WHERE code NOT IN ('LIBCEMENT', 'JALYANA', 'WAHDA_BANK', 'CUSTOMS');
DELETE FROM insurance_companies WHERE code NOT IN ('ALWAHA_INS', 'WAAD_TPA');

-- Verify cleanup
SELECT * FROM insurance_companies;
SELECT * FROM employers;
```

---

## 📞 Support

For questions about the organizational structure:
- **System Admin:** admin@tba.sa
- **Documentation:** This README
- **Setup Script:** `/backend/setup-official-data.sh`

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-26 | Initial official structure definition |
| 1.0 | 2025-11-26 | Added automated setup script |
| 1.0 | 2025-11-26 | Frontend constants created |
| 1.0 | 2025-11-26 | Updated test scripts |

---

**Last Updated:** November 26, 2025  
**Maintained By:** TBA-WAAD Development Team  
**Status:** ✅ Official & Active
