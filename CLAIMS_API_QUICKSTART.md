# 🚀 Claims API Quick Start Guide

**Status:** ✅ FULLY OPERATIONAL  
**Base URL:** `http://localhost:8080`  
**Auth:** JWT Bearer Token Required

---

## 📋 Prerequisites

1. **Start Application:**
   ```bash
   cd /workspaces/tba-waad-system/backend
   mvn spring-boot:run
   ```

2. **Wait for startup:** (~20 seconds)
   ```
   Started TbaWaadApplication in 17.562 seconds
   Tomcat started on port 8080
   ```

---

## 🔐 Authentication

### Step 1: Login and Get Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@tba.sa",
      "fullName": "System Administrator",
      "roles": ["SUPER_ADMIN"]
    }
  }
}
```

### Step 2: Set Token Variable
```bash
export TOKEN="<paste-token-here>"
```

---

## 📝 Claims CRUD Operations

### 1. Create a Claim

**Prerequisites:** You need a Member and Provider (or use seed data)

```bash
curl -X POST http://localhost:8080/api/claims \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "providerId": 1,
    "providerName": "Al-Shifa Medical Center",
    "claimType": "OUTPATIENT",
    "serviceDate": "2025-11-25",
    "submissionDate": "2025-11-25",
    "totalClaimed": 1500.00,
    "diagnosisCode": "J11.1",
    "diagnosisDescription": "Influenza with other respiratory manifestations",
    "notes": "Patient visited for flu symptoms"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "claimNumber": "CLM-1732567890123-A1B2C3D4",
    "memberId": 1,
    "memberName": "Fatima Al-Mahdi",
    "memberCardNumber": "MBR-0001",
    "providerId": 1,
    "providerName": "Al-Shifa Medical Center",
    "claimType": "OUTPATIENT",
    "serviceDate": "2025-11-25",
    "submissionDate": "2025-11-25",
    "totalClaimed": 1500.00,
    "totalApproved": null,
    "status": "PENDING",
    "diagnosisCode": "J11.1",
    "diagnosisDescription": "Influenza with other respiratory manifestations",
    "notes": "Patient visited for flu symptoms",
    "active": true,
    "createdAt": "2025-11-25T21:40:15.123Z",
    "updatedAt": "2025-11-25T21:40:15.123Z"
  }
}
```

---

### 2. Get All Claims (Paginated)

```bash
curl -X GET "http://localhost:8080/api/claims?page=1&size=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "claimNumber": "CLM-1732567890123-A1B2C3D4",
        "memberName": "Fatima Al-Mahdi",
        "status": "PENDING",
        "totalClaimed": 1500.00
      }
    ],
    "total": 1,
    "page": 1,
    "size": 10
  }
}
```

---

### 3. Get Claim by ID

```bash
curl -X GET http://localhost:8080/api/claims/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Update Claim

```bash
curl -X PUT http://localhost:8080/api/claims/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "providerId": 1,
    "providerName": "Al-Shifa Medical Center",
    "claimType": "OUTPATIENT",
    "serviceDate": "2025-11-25",
    "submissionDate": "2025-11-25",
    "totalClaimed": 1600.00,
    "diagnosisCode": "J11.1",
    "diagnosisDescription": "Influenza - Updated",
    "notes": "Updated claim amount"
  }'
```

---

### 5. Delete Claim

```bash
curl -X DELETE http://localhost:8080/api/claims/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "status": "success",
  "message": "Claim deleted successfully",
  "timestamp": "2025-11-25T21:45:00.000Z"
}
```

---

## 🔍 Query & Search Operations

### 1. Search Claims

```bash
curl -X GET "http://localhost:8080/api/claims/search?query=flu" \
  -H "Authorization: Bearer $TOKEN"
```

Searches in:
- Claim number
- Notes
- Provider name

---

### 2. Get Claims by Status

```bash
curl -X GET "http://localhost:8080/api/claims/status/PENDING" \
  -H "Authorization: Bearer $TOKEN"
```

**Available Statuses:**
- `PENDING`
- `UNDER_MEDICAL_REVIEW`
- `UNDER_FINANCIAL_REVIEW`
- `APPROVED`
- `REJECTED`
- `PAID`

---

### 3. Get Claims Count

```bash
curl -X GET http://localhost:8080/api/claims/count \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "status": "success",
  "data": 15
}
```

---

## ✅ Approval Workflow

### 1. Approve Claim

**Required Permission:** `claim.approve`

```bash
curl -X POST http://localhost:8080/api/claims/1/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": 1,
    "approvedAmount": 1400.00
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "claimNumber": "CLM-1732567890123-A1B2C3D4",
    "status": "APPROVED",
    "totalClaimed": 1500.00,
    "totalApproved": 1400.00,
    "totalRejected": 100.00,
    "financialReviewStatus": "APPROVED",
    "financialReviewedAt": "2025-11-25T21:50:00.000Z"
  }
}
```

**Notes:**
- Updates status to `APPROVED`
- Records `financialReviewer` (User ID)
- Sets `financialReviewedAt` timestamp
- Calculates `netPayable` = `totalApproved` - `memberCoPayment`

---

### 2. Reject Claim

**Required Permission:** `claim.reject`

```bash
curl -X POST http://localhost:8080/api/claims/1/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": 1,
    "rejectionReason": "Service not covered under policy"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "claimNumber": "CLM-1732567890123-A1B2C3D4",
    "status": "REJECTED",
    "totalClaimed": 1500.00,
    "totalApproved": 0.00,
    "totalRejected": 1500.00,
    "rejectionReason": "Service not covered under policy",
    "financialReviewStatus": "REJECTED",
    "financialReviewedAt": "2025-11-25T21:55:00.000Z"
  }
}
```

---

### 3. Mark Under Medical Review

```bash
curl -X PATCH http://localhost:8080/api/claims/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "UNDER_MEDICAL_REVIEW",
    "reviewerId": 1
  }'
```

---

## 📊 Statistics & Reports

### 1. Get Claims by Date Range

```bash
curl -X GET "http://localhost:8080/api/claims?startDate=2025-11-01&endDate=2025-11-30" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2. Get Monthly Statistics

```bash
curl -X GET "http://localhost:8080/api/dashboard/claims/monthly?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "month": 11,
      "year": 2025,
      "count": 15,
      "totalClaimed": 25000.00,
      "totalApproved": 22000.00
    }
  ]
}
```

---

### 3. Get Daily Statistics

```bash
curl -X GET "http://localhost:8080/api/dashboard/claims/daily?startDate=2025-11-20&endDate=2025-11-25" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Testing Complete Workflow

### Complete Example: Create → Review → Approve

```bash
#!/bin/bash

# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin@123"}' | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Create Claim
CLAIM_ID=$(curl -s -X POST http://localhost:8080/api/claims \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "providerId": 1,
    "providerName": "Al-Shifa Hospital",
    "claimType": "OUTPATIENT",
    "serviceDate": "2025-11-25",
    "totalClaimed": 2000.00,
    "diagnosisCode": "M79.3",
    "diagnosisDescription": "Panniculitis"
  }' | jq -r '.data.id')

echo "Created Claim ID: $CLAIM_ID"

# 3. Get Claim
curl -s -X GET "http://localhost:8080/api/claims/$CLAIM_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. Approve Claim
curl -s -X POST "http://localhost:8080/api/claims/$CLAIM_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": 1,
    "approvedAmount": 1800.00
  }' | jq .

# 5. Verify Final Status
curl -s -X GET "http://localhost:8080/api/claims/$CLAIM_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 🔐 Required Permissions

| Action | Permission | Default Roles |
|--------|-----------|---------------|
| View Claims | `claim.view` | SUPER_ADMIN, ADMIN, MANAGER, USER |
| Create/Update Claims | `claim.manage` | SUPER_ADMIN, ADMIN, MANAGER |
| Approve Claims | `claim.approve` | SUPER_ADMIN, ADMIN |
| Reject Claims | `claim.reject` | SUPER_ADMIN, ADMIN |

---

## 🎯 Claim Types

| Type | Description | Use Case |
|------|-------------|----------|
| `OUTPATIENT` | Outpatient services | Doctor visits, labs, X-rays |
| `INPATIENT` | Inpatient hospitalization | Surgery, hospital stay |
| `PHARMACY` | Pharmacy/medication | Prescriptions, drugs |

---

## 📝 Field Validations

### Required Fields:
- `memberId` ✅
- `providerId` ✅
- `claimType` ✅
- `serviceDate` ✅
- `totalClaimed` ✅

### Optional Fields:
- `claimNumber` (auto-generated if not provided)
- `submissionDate` (defaults to current date)
- `providerName`
- `diagnosisCode`, `diagnosisDescription`
- `preAuthNumber`
- `notes`

### Field Formats:
- **Dates:** `YYYY-MM-DD` (ISO 8601)
- **Money:** Decimal with 2 decimal places (e.g., `1500.00`)
- **ClaimType:** Enum (`OUTPATIENT`, `INPATIENT`, `PHARMACY`)

---

## 🚨 Common Errors

### 1. Authentication Error
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```
**Solution:** Get a new token using `/api/auth/login`

---

### 2. Validation Error
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "memberId": "Member ID is required"
  }
}
```
**Solution:** Check required fields

---

### 3. Resource Not Found
```json
{
  "status": "error",
  "code": "RESOURCE_NOT_FOUND",
  "message": "Claim not found with id: 999"
}
```
**Solution:** Verify claim ID exists

---

### 4. Permission Denied
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "Access denied"
}
```
**Solution:** Check user has required permission (`claim.approve`, etc.)

---

## 📚 Related Endpoints

### Member Module
- `GET /api/members` - List all members
- `GET /api/members/{id}` - Get member details
- `GET /api/members/{id}/claims` - Get member's claims

### Provider Module (Coming Soon)
- `GET /api/providers` - List providers
- `GET /api/providers/{id}/claims` - Get provider claims

### Policy Module
- `GET /api/policies` - List policies
- `GET /api/policies/{id}` - Get policy details

---

## ✅ Next Steps

1. **Test CRUD Operations** - Create, read, update, delete claims
2. **Test Approval Workflow** - Approve/reject claims
3. **Add ClaimLines** - Line-item details for each claim
4. **Integrate PreAuthorization** - Link to pre-approvals
5. **Add Member Co-payment** - Calculate patient responsibility

---

## 📞 Support

For issues or questions:
- Check application logs: `/tmp/app.log`
- Review errors in response messages
- Verify JWT token is valid
- Check user permissions in RBAC module

---

**API Status:** 🟢 **FULLY OPERATIONAL**  
**Last Updated:** 2025-11-25  
**Version:** 1.0.0
