# Insurance Entities Implementation - TBA-WAAD System

## Overview
This document describes the newly added Insurance Company, Policy, and Benefit Table entities with full JPA relationships for the TBA-WAAD Health Insurance Platform.

---

## 1. Entities Created

### 1.1 InsuranceCompany Entity
**Location:** `/backend/src/main/java/com/waad/tba/model/InsuranceCompany.java`

**Fields:**
- `id` (Long) - Primary key, auto-generated
- `name` (String) - Company name, required
- `contactInfo` (String) - General contact information
- `email` (String) - Email address, required
- `phone` (String) - Phone number
- `address` (String) - Physical address (TEXT)
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Relationships:**
- `OneToMany` with Policy (mapped by `insuranceCompany`)

---

### 1.2 Policy Entity
**Location:** `/backend/src/main/java/com/waad/tba/model/Policy.java`

**Fields:**
- `id` (Long) - Primary key, auto-generated
- `policyNumber` (String) - Unique policy identifier, required
- `coverageType` (String) - Type of coverage, required
- `startDate` (LocalDate) - Policy start date, required
- `endDate` (LocalDate) - Policy end date, required
- `totalLimit` (BigDecimal) - Maximum coverage limit
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Relationships:**
- `ManyToOne` with InsuranceCompany (required)
- `ManyToOne` with Organization (required)
- `OneToMany` with BenefitTable (mapped by `policy`)
- `OneToMany` with Member (mapped by `policy`)

---

### 1.3 BenefitTable Entity
**Location:** `/backend/src/main/java/com/waad/tba/model/BenefitTable.java`

**Fields:**
- `id` (Long) - Primary key, auto-generated
- `serviceType` (String) - Type of medical service, required
- `coveragePercent` (BigDecimal) - Coverage percentage (0-100)
- `maxLimit` (BigDecimal) - Maximum coverage amount for this service
- `notes` (String) - Additional notes (TEXT)
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Relationships:**
- `ManyToOne` with Policy (required)

---

### 1.4 Member Entity Update
**Location:** `/backend/src/main/java/com/waad/tba/model/Member.java`

**Added Relationship:**
- `ManyToOne` with Policy (optional)
- This allows each member to be linked to a specific policy

---

## 2. Repositories Created

### 2.1 InsuranceCompanyRepository
**Location:** `/backend/src/main/java/com/waad/tba/repository/InsuranceCompanyRepository.java`

**Methods:**
- `findByEmail(String email)` - Find insurance company by email
- `findByName(String name)` - Find insurance company by name
- Standard JpaRepository methods (findAll, findById, save, delete, etc.)

---

### 2.2 PolicyRepository
**Location:** `/backend/src/main/java/com/waad/tba/repository/PolicyRepository.java`

**Methods:**
- `findByPolicyNumber(String policyNumber)` - Find policy by policy number
- `findByInsuranceCompanyId(Long insuranceCompanyId)` - Get all policies for an insurance company
- `findByOrganizationId(Long organizationId)` - Get all policies for an organization
- Standard JpaRepository methods

---

### 2.3 BenefitTableRepository
**Location:** `/backend/src/main/java/com/waad/tba/repository/BenefitTableRepository.java`

**Methods:**
- `findByPolicyId(Long policyId)` - Get all benefits for a policy
- `findByServiceType(String serviceType)` - Find benefits by service type
- Standard JpaRepository methods

---

## 3. Services Created

### 3.1 InsuranceCompanyService
**Location:** `/backend/src/main/java/com/waad/tba/service/InsuranceCompanyService.java`

**Methods:**
- `getAllInsuranceCompanies()` - Get all insurance companies
- `getInsuranceCompanyById(Long id)` - Get by ID
- `getInsuranceCompanyByEmail(String email)` - Get by email
- `createInsuranceCompany(InsuranceCompany)` - Create new
- `updateInsuranceCompany(Long id, InsuranceCompany)` - Update existing
- `deleteInsuranceCompany(Long id)` - Delete by ID

---

### 3.2 PolicyService
**Location:** `/backend/src/main/java/com/waad/tba/service/PolicyService.java`

**Methods:**
- `getAllPolicies()` - Get all policies
- `getPolicyById(Long id)` - Get by ID
- `getPolicyByPolicyNumber(String policyNumber)` - Get by policy number
- `getPoliciesByInsuranceCompany(Long insuranceCompanyId)` - Get by insurance company
- `getPoliciesByOrganization(Long organizationId)` - Get by organization
- `createPolicy(Policy)` - Create new
- `updatePolicy(Long id, Policy)` - Update existing
- `deletePolicy(Long id)` - Delete by ID

---

### 3.3 BenefitTableService
**Location:** `/backend/src/main/java/com/waad/tba/service/BenefitTableService.java`

**Methods:**
- `getAllBenefitTables()` - Get all benefit tables
- `getBenefitTableById(Long id)` - Get by ID
- `getBenefitTablesByPolicy(Long policyId)` - Get by policy
- `getBenefitTablesByServiceType(String serviceType)` - Get by service type
- `createBenefitTable(BenefitTable)` - Create new
- `updateBenefitTable(Long id, BenefitTable)` - Update existing
- `deleteBenefitTable(Long id)` - Delete by ID

---

## 4. DTOs Created

### 4.1 InsuranceCompanyDTO
**Location:** `/backend/src/main/java/com/waad/tba/dto/InsuranceCompanyDTO.java`

Contains all fields from InsuranceCompany entity for API responses.

---

### 4.2 PolicyDTO
**Location:** `/backend/src/main/java/com/waad/tba/dto/PolicyDTO.java`

Contains all fields from Policy entity plus:
- `insuranceCompanyName` - Name of the insurance company
- `organizationName` - Name of the organization

---

### 4.3 BenefitTableDTO
**Location:** `/backend/src/main/java/com/waad/tba/dto/BenefitTableDTO.java`

Contains all fields from BenefitTable entity plus:
- `policyNumber` - Associated policy number

---

## 5. REST Controllers Created

### 5.1 InsuranceCompanyController
**Location:** `/backend/src/main/java/com/waad/tba/controller/InsuranceCompanyController.java`

**Base URL:** `/api/insurance`

**Security:** ADMIN and INSURANCE roles

**Endpoints:**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/insurance` | Get all insurance companies | ADMIN, INSURANCE |
| GET | `/api/insurance/{id}` | Get by ID | ADMIN, INSURANCE |
| GET | `/api/insurance/email/{email}` | Get by email | ADMIN, INSURANCE |
| POST | `/api/insurance` | Create new | ADMIN |
| PUT | `/api/insurance/{id}` | Update | ADMIN, INSURANCE |
| DELETE | `/api/insurance/{id}` | Delete | ADMIN |

---

### 5.2 PolicyController
**Location:** `/backend/src/main/java/com/waad/tba/controller/PolicyController.java`

**Base URL:** `/api/policy`

**Security:** ADMIN and INSURANCE roles (with some EMPLOYER access)

**Endpoints:**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/policy` | Get all policies | ADMIN, INSURANCE |
| GET | `/api/policy/{id}` | Get by ID | ADMIN, INSURANCE, EMPLOYER |
| GET | `/api/policy/number/{policyNumber}` | Get by policy number | ADMIN, INSURANCE, EMPLOYER |
| GET | `/api/policy/insurance-company/{id}` | Get by insurance company | ADMIN, INSURANCE |
| GET | `/api/policy/organization/{id}` | Get by organization | ADMIN, INSURANCE, EMPLOYER |
| POST | `/api/policy` | Create new | ADMIN, INSURANCE |
| PUT | `/api/policy/{id}` | Update | ADMIN, INSURANCE |
| DELETE | `/api/policy/{id}` | Delete | ADMIN |

---

### 5.3 BenefitTableController
**Location:** `/backend/src/main/java/com/waad/tba/controller/BenefitTableController.java`

**Base URL:** `/api/benefits`

**Security:** ADMIN and INSURANCE roles (with EMPLOYER and PROVIDER read access)

**Endpoints:**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/benefits` | Get all benefit tables | ADMIN, INSURANCE |
| GET | `/api/benefits/{id}` | Get by ID | ADMIN, INSURANCE, EMPLOYER, PROVIDER |
| GET | `/api/benefits/policy/{policyId}` | Get by policy | ADMIN, INSURANCE, EMPLOYER, PROVIDER |
| GET | `/api/benefits/service-type/{serviceType}` | Get by service type | ADMIN, INSURANCE, PROVIDER |
| POST | `/api/benefits` | Create new | ADMIN, INSURANCE |
| PUT | `/api/benefits/{id}` | Update | ADMIN, INSURANCE |
| DELETE | `/api/benefits/{id}` | Delete | ADMIN |

---

## 6. Security Implementation

All controllers use:
- **JWT Authentication** via `@SecurityRequirement(name = "Bearer Authentication")`
- **Role-based Authorization** via `@PreAuthorize` annotations
- **Roles:** ADMIN, INSURANCE, EMPLOYER, PROVIDER, MEMBER

**Access Control:**
- **ADMIN** - Full access to all operations
- **INSURANCE** - Full read/write access to their data
- **EMPLOYER** - Read access to policies and benefits
- **PROVIDER** - Read access to benefits
- **MEMBER** - No direct access to insurance/policy management

---

## 7. Swagger Documentation

All endpoints are automatically documented in Swagger UI with:
- **Tags:** Insurance Companies, Policies, Benefit Tables
- **Descriptions:** Clear operation summaries
- **Security:** Bearer token authentication required
- **Access:** Available at `http://localhost:8080/swagger-ui.html`

---

## 8. Database Schema

The following tables will be created automatically by Hibernate:

### insurance_companies
```sql
CREATE TABLE insurance_companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

### policies
```sql
CREATE TABLE policies (
    id BIGSERIAL PRIMARY KEY,
    policy_number VARCHAR(255) UNIQUE NOT NULL,
    coverage_type VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_limit DECIMAL(15,2),
    insurance_company_id BIGINT NOT NULL REFERENCES insurance_companies(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

### benefit_tables
```sql
CREATE TABLE benefit_tables (
    id BIGSERIAL PRIMARY KEY,
    service_type VARCHAR(255) NOT NULL,
    coverage_percent DECIMAL(5,2),
    max_limit DECIMAL(15,2),
    notes TEXT,
    policy_id BIGINT NOT NULL REFERENCES policies(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

### members (updated)
```sql
ALTER TABLE members ADD COLUMN policy_id BIGINT REFERENCES policies(id);
```

---

## 9. Testing

Once the backend is running, you can test the endpoints using:

### Swagger UI
Visit: `http://localhost:8080/swagger-ui.html`

### cURL Examples

**Create Insurance Company:**
```bash
curl -X POST http://localhost:8080/api/insurance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Insurance Co.",
    "email": "info@abcinsurance.com",
    "phone": "+966-11-1234567",
    "address": "Riyadh, Saudi Arabia",
    "contactInfo": "Contact our support team"
  }'
```

**Create Policy:**
```bash
curl -X POST http://localhost:8080/api/policy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-2024-001",
    "coverageType": "Comprehensive Health Insurance",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "totalLimit": 500000.00,
    "insuranceCompany": {"id": 1},
    "organization": {"id": 1}
  }'
```

**Create Benefit Table:**
```bash
curl -X POST http://localhost:8080/api/benefits \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "GP Consultation",
    "coveragePercent": 100.00,
    "maxLimit": 500.00,
    "notes": "Fully covered up to limit",
    "policy": {"id": 1}
  }'
```

---

## 10. Next Steps

To integrate these new entities with your system:

1. **Start the backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Verify Swagger documentation:**
   - Open `http://localhost:8080/swagger-ui.html`
   - Check for "Insurance Companies", "Policies", and "Benefit Tables" sections

3. **Create test data:**
   - Use Swagger UI or Postman to create insurance companies, policies, and benefits
   - Link members to policies

4. **Frontend Integration (if needed):**
   - Create React components for managing these entities
   - Use the existing API service patterns in `/frontend/src/services/`

---

## 11. Relationships Summary

```
InsuranceCompany (1) ----< (N) Policy (N) >---- (1) Organization
                              |
                              | (1)
                              |
                              v (N)
                         BenefitTable
                              
Policy (1) ----< (N) Member
```

---

## Files Created/Modified

### Created:
1. `backend/src/main/java/com/waad/tba/model/InsuranceCompany.java`
2. `backend/src/main/java/com/waad/tba/model/Policy.java`
3. `backend/src/main/java/com/waad/tba/model/BenefitTable.java`
4. `backend/src/main/java/com/waad/tba/repository/InsuranceCompanyRepository.java`
5. `backend/src/main/java/com/waad/tba/repository/PolicyRepository.java`
6. `backend/src/main/java/com/waad/tba/repository/BenefitTableRepository.java`
7. `backend/src/main/java/com/waad/tba/service/InsuranceCompanyService.java`
8. `backend/src/main/java/com/waad/tba/service/PolicyService.java`
9. `backend/src/main/java/com/waad/tba/service/BenefitTableService.java`
10. `backend/src/main/java/com/waad/tba/dto/InsuranceCompanyDTO.java`
11. `backend/src/main/java/com/waad/tba/dto/PolicyDTO.java`
12. `backend/src/main/java/com/waad/tba/dto/BenefitTableDTO.java`
13. `backend/src/main/java/com/waad/tba/controller/InsuranceCompanyController.java`
14. `backend/src/main/java/com/waad/tba/controller/PolicyController.java`
15. `backend/src/main/java/com/waad/tba/controller/BenefitTableController.java`

### Modified:
1. `backend/src/main/java/com/waad/tba/model/Member.java` - Added Policy relationship

---

## Support

For issues or questions about these new entities, refer to:
- Existing controller patterns in `/backend/src/main/java/com/waad/tba/controller/`
- JPA documentation for relationship management
- Spring Security documentation for role-based access control
