# TBA-WAAD API Quick Start Guide

## 1. Setup Database

```sql
-- Login to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE tba_waad;

-- Verify database created
\l

-- Exit psql
\q
```

## 2. Start the Application

```bash
cd backend
mvn spring-boot:run
```

The application will:
- Start on port 8080
- Create database tables automatically
- Initialize default test users

## 3. Default Test Users

| Username   | Password      | Role      |
|------------|---------------|-----------|
| admin      | admin123      | ADMIN     |
| insurance  | insurance123  | INSURANCE |
| provider   | provider123   | PROVIDER  |
| employer   | employer123   | EMPLOYER  |
| member     | member123     | MEMBER    |

## 4. API Testing Examples

### Login as Admin

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@tba-waad.com",
  "fullName": "System Administrator",
  "roles": ["ADMIN", "INSURANCE"]
}
```

### Create Organization

```bash
curl -X POST http://localhost:8080/api/organizations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Corp",
    "registrationNumber": "REG12345",
    "industry": "Technology",
    "address": "123 Tech Street, San Francisco, CA",
    "phone": "+1-415-555-0100",
    "email": "hr@techcorp.com",
    "contactPerson": "Jane Doe",
    "active": true
  }'
```

### Create Provider

```bash
curl -X POST http://localhost:8080/api/providers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "City General Hospital",
    "licenseNumber": "LIC-2024-001",
    "type": "HOSPITAL",
    "specialties": "General Medicine, Surgery, Pediatrics",
    "address": "456 Health Ave, San Francisco, CA",
    "phone": "+1-415-555-0200",
    "email": "contact@cityhospital.com",
    "contactPerson": "Dr. John Smith",
    "status": "APPROVED",
    "active": true
  }'
```

### Create Member

```bash
curl -X POST http://localhost:8080/api/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "memberNumber": "MEM-2024-001",
    "fullName": "Alice Johnson",
    "email": "alice.johnson@email.com",
    "phone": "+1-415-555-0300",
    "dateOfBirth": "1985-03-15",
    "gender": "FEMALE",
    "address": "789 Main St, San Francisco, CA",
    "nationalId": "123-45-6789",
    "organization": {"id": 1},
    "policyNumber": "POL-2024-001",
    "coverageStartDate": "2024-01-01",
    "coverageEndDate": "2024-12-31",
    "coverageStatus": "ACTIVE"
  }'
```

### Submit Claim

```bash
curl -X POST http://localhost:8080/api/claims \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "claimNumber": "CLM-2024-001",
    "member": {"id": 1},
    "provider": {"id": 1},
    "serviceDate": "2024-01-15",
    "diagnosis": "Acute bronchitis",
    "treatmentDescription": "Consultation and medication",
    "claimedAmount": 250.00,
    "documentUrls": "https://storage.example.com/doc1.pdf"
  }'
```

### Approve Claim

```bash
curl -X PATCH "http://localhost:8080/api/claims/1/approve?reviewedBy=admin" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Pre-Authorization

```bash
curl -X POST http://localhost:8080/api/approvals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "approvalNumber": "APP-2024-001",
    "member": {"id": 1},
    "provider": {"id": 1},
    "procedureName": "MRI Scan",
    "procedureDescription": "Brain MRI with contrast",
    "estimatedCost": 1500.00,
    "proposedDate": "2024-02-01",
    "justification": "Persistent headaches, neurological examination recommended"
  }'
```

### Get Dashboard Statistics

```bash
curl -X GET http://localhost:8080/api/reports/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Claims

```bash
curl -X GET http://localhost:8080/api/claims \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Claims by Status

```bash
curl -X GET http://localhost:8080/api/claims/status/PENDING \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Access Swagger UI

Open your browser and navigate to:
```
http://localhost:8080/swagger-ui.html
```

You can test all APIs interactively using the Swagger interface:
1. Click "Authorize" button
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"
4. Now you can test any endpoint

## 6. Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 7. Postman Collection

You can import the Swagger JSON into Postman:
1. Open Postman
2. Click Import
3. Enter URL: `http://localhost:8080/api-docs`
4. Postman will create a collection with all endpoints

## 8. Testing Workflow

### Complete Claim Processing Flow:

1. **Login** → Get JWT token
2. **Create Organization** → Get organization ID
3. **Create Provider** → Get provider ID
4. **Create Member** → Assign to organization
5. **Submit Claim** → Link member and provider
6. **Review Claim** → Approve/Reject by insurance
7. **Generate Invoice** → Create finance record
8. **Mark as Paid** → Complete the cycle

### Example Complete Flow:

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. Create Organization
ORG_ID=$(curl -s -X POST http://localhost:8080/api/organizations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tech Corp","registrationNumber":"REG001","active":true}' \
  | jq -r '.id')

# 3. Create Provider  
PROVIDER_ID=$(curl -s -X POST http://localhost:8080/api/providers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"City Hospital","licenseNumber":"LIC001","type":"HOSPITAL","status":"APPROVED","active":true}' \
  | jq -r '.id')

# 4. Create Member
MEMBER_ID=$(curl -s -X POST http://localhost:8080/api/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"memberNumber\":\"MEM001\",\"fullName\":\"John Doe\",\"email\":\"john@email.com\",\"organization\":{\"id\":$ORG_ID},\"coverageStatus\":\"ACTIVE\"}" \
  | jq -r '.id')

# 5. Submit Claim
CLAIM_ID=$(curl -s -X POST http://localhost:8080/api/claims \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"claimNumber\":\"CLM001\",\"member\":{\"id\":$MEMBER_ID},\"provider\":{\"id\":$PROVIDER_ID},\"serviceDate\":\"2024-01-15\",\"diagnosis\":\"Test\",\"claimedAmount\":100}" \
  | jq -r '.id')

# 6. Approve Claim
curl -X PATCH "http://localhost:8080/api/claims/$CLAIM_ID/approve?reviewedBy=admin" \
  -H "Authorization: Bearer $TOKEN"

echo "Workflow completed! Claim ID: $CLAIM_ID"
```

## 9. Troubleshooting

### "Access Denied" Error
- Verify you're using the correct role for the endpoint
- Check that your token hasn't expired (24 hours default)
- Ensure the Authorization header format is correct: `Bearer <token>`

### Database Connection Error
```bash
# Check PostgreSQL status
sudo service postgresql status

# Start PostgreSQL if not running
sudo service postgresql start

# Test connection
psql -U postgres -d tba_waad
```

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

## 10. Next Steps

- Customize roles and permissions in `SecurityConfig.java`
- Implement report generation logic in `ReportController.java`
- Add audit logging for sensitive operations
- Implement file upload for claim documents
- Add email notifications for claim status changes
- Implement pagination for list endpoints
- Add comprehensive unit and integration tests
