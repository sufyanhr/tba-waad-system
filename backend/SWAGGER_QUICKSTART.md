# 🚀 Swagger UI - Quick Start Guide

## 📍 Access Swagger UI

### Main URL:
```
http://localhost:8080/swagger-ui.html
```

Or directly:
```
http://localhost:8080/swagger-ui/index.html
```

---

## 🔐 How to Authenticate

### Step 1: Login via API
Use the **Authentication** section in Swagger UI:

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "identifier": "admin@tba.sa",
  "password": "Admin@123"
}
```

**Click:** `Try it out` → `Execute`

### Step 2: Copy JWT Token
From the response, copy the value of `data.token`:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkB0YmEuc2EiLCJpYXQiOjE3MzI2MzU4NjYsImV4cCI6MTczMjcyMjI2Nn0.ABC123...",
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "Super Admin",
      "email": "admin@tba.sa",
      "roles": ["SUPER_ADMIN"],
      "permissions": [...]
    }
  }
}
```

### Step 3: Authorize in Swagger
1. Click the **🔓 Authorize** button (top right)
2. In the "BearerAuth" dialog, enter:
   ```
   Bearer <paste-your-token-here>
   ```
3. Click **Authorize**
4. Click **Close**

### Step 4: Test Protected Endpoints
Now you can test any protected endpoint:
- ✅ Members
- ✅ Employers
- ✅ Claims
- ✅ Policies
- ✅ Benefit Packages
- ✅ Pre-Authorizations
- etc.

---

## 📚 Available Modules

### 1. Authentication (Public)
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/forgot-password` - Request OTP
- ✅ `POST /api/auth/reset-password` - Reset password with OTP
- ✅ `GET /api/auth/me` - Get current user info

### 2. RBAC - Users (Protected)
- ✅ `GET /api/admin/users` - List all users
- ✅ `POST /api/admin/users` - Create user
- ✅ `GET /api/admin/users/{id}` - Get user by ID
- ✅ `PUT /api/admin/users/{id}` - Update user
- ✅ `DELETE /api/admin/users/{id}` - Delete user
- ✅ `POST /api/admin/users/{id}/assign-roles` - Assign roles

### 3. RBAC - Roles (Protected)
- ✅ `GET /api/admin/roles` - List all roles
- ✅ `POST /api/admin/roles` - Create role
- ✅ `GET /api/admin/roles/{id}` - Get role by ID
- ✅ `PUT /api/admin/roles/{id}` - Update role
- ✅ `DELETE /api/admin/roles/{id}` - Delete role
- ✅ `POST /api/admin/roles/{id}/assign-permissions` - Assign permissions

### 4. RBAC - Permissions (Protected)
- ✅ `GET /api/admin/permissions` - List all permissions
- ✅ `POST /api/admin/permissions` - Create permission
- ✅ `GET /api/admin/permissions/{id}` - Get permission by ID
- ✅ `PUT /api/admin/permissions/{id}` - Update permission
- ✅ `DELETE /api/admin/permissions/{id}` - Delete permission

### 5. Members (Protected)
- ✅ `GET /api/members` - List members (paginated)
- ✅ `POST /api/members` - Create member
- ✅ `GET /api/members/{id}` - Get member by ID
- ✅ `PUT /api/members/{id}` - Update member
- ✅ `DELETE /api/members/{id}` - Delete member
- ✅ `GET /api/members/count` - Count total members

### 6. Employers (Protected)
- ✅ `GET /api/employers` - List employers (paginated)
- ✅ `POST /api/employers` - Create employer
- ✅ `GET /api/employers/{id}` - Get employer by ID
- ✅ `PUT /api/employers/{id}` - Update employer
- ✅ `DELETE /api/employers/{id}` - Delete employer
- ✅ `GET /api/employers/count` - Count total employers

### 7. Insurance Companies (Protected)
- ✅ `GET /api/insurance-companies` - List insurance companies
- ✅ `POST /api/insurance-companies` - Create insurance company
- ✅ `GET /api/insurance-companies/{id}` - Get by ID
- ✅ `PUT /api/insurance-companies/{id}` - Update
- ✅ `DELETE /api/insurance-companies/{id}` - Delete

### 8. Reviewer Companies (Protected)
- ✅ `GET /api/reviewer-companies` - List reviewer companies
- ✅ `POST /api/reviewer-companies` - Create reviewer company
- ✅ `GET /api/reviewer-companies/{id}` - Get by ID
- ✅ `PUT /api/reviewer-companies/{id}` - Update
- ✅ `DELETE /api/reviewer-companies/{id}` - Delete

### 9. Policies (Protected)
- ✅ `GET /api/policies` - List all policies
- ✅ `POST /api/policies` - Create policy
- ✅ `GET /api/policies/{id}` - Get policy by ID
- ✅ `PUT /api/policies/{id}` - Update policy
- ✅ `DELETE /api/policies/{id}` - Delete policy
- ✅ `GET /api/policies/active` - Get active policies
- ✅ `GET /api/policies/employer/{employerId}` - Get by employer
- ✅ `PATCH /api/policies/{id}/status` - Update policy status

### 10. Benefit Packages (Protected)
- ✅ `GET /api/benefit-packages` - List all packages
- ✅ `POST /api/benefit-packages` - Create package
- ✅ `GET /api/benefit-packages/{id}` - Get by ID
- ✅ `PUT /api/benefit-packages/{id}` - Update package
- ✅ `DELETE /api/benefit-packages/{id}` - Delete package
- ✅ `GET /api/benefit-packages/active` - Get active packages
- ✅ `GET /api/benefit-packages/code/{code}` - Get by code

### 11. Pre-Authorizations (Protected)
- ✅ `GET /api/pre-authorizations` - List all pre-auths
- ✅ `POST /api/pre-authorizations` - Create pre-auth
- ✅ `GET /api/pre-authorizations/{id}` - Get by ID
- ✅ `PUT /api/pre-authorizations/{id}` - Update pre-auth
- ✅ `DELETE /api/pre-authorizations/{id}` - Delete pre-auth
- ✅ `POST /api/pre-authorizations/{id}/approve` - Approve
- ✅ `POST /api/pre-authorizations/{id}/reject` - Reject
- ✅ `POST /api/pre-authorizations/{id}/under-review` - Mark under review
- ✅ `GET /api/pre-authorizations/status/{status}` - Filter by status
- ✅ `GET /api/pre-authorizations/member/{memberId}` - Get by member
- ✅ `GET /api/pre-authorizations/provider/{providerId}` - Get by provider

### 12. Claims Management (Protected)
- ✅ `GET /api/claims` - List claims (paginated)
- ✅ `POST /api/claims` - Create claim
- ✅ `GET /api/claims/{id}` - Get claim by ID
- ✅ `PUT /api/claims/{id}` - Update claim
- ✅ `DELETE /api/claims/{id}` - Delete claim
- ✅ `POST /api/claims/{id}/approve` - Approve claim
- ✅ `POST /api/claims/{id}/reject` - Reject claim
- ✅ `GET /api/claims/status/{status}` - Filter by status
- ✅ `GET /api/claims/count` - Count total claims

### 13. Visits (Protected)
- ✅ `GET /api/visits` - List visits (paginated)
- ✅ `POST /api/visits` - Create visit
- ✅ `GET /api/visits/{id}` - Get visit by ID
- ✅ `PUT /api/visits/{id}` - Update visit
- ✅ `DELETE /api/visits/{id}` - Delete visit
- ✅ `GET /api/visits/count` - Count total visits

### 14. Medical Services (Protected)
- ✅ `GET /api/medical-services` - List all services
- ✅ `POST /api/medical-services` - Create service
- ✅ `PUT /api/medical-services/{id}` - Update service
- ✅ `DELETE /api/medical-services/{id}` - Delete service

### 15. Medical Categories (Protected)
- ✅ `GET /api/medical-categories` - List all categories
- ✅ `POST /api/medical-categories` - Create category
- ✅ `GET /api/medical-categories/{id}` - Get by ID
- ✅ `PUT /api/medical-categories/{id}` - Update category
- ✅ `DELETE /api/medical-categories/{id}` - Delete category
- ✅ `GET /api/medical-categories/code/{code}` - Get by code

### 16. Dashboard (Protected)
- ✅ `GET /api/dashboard/stats` - Get dashboard statistics
- ✅ `GET /api/dashboard/claims-per-day` - Get claims per day chart data

### 17. System Administration (Protected)
- ✅ `POST /api/admin/system/init-defaults` - Initialize default data
- ✅ `POST /api/admin/system/seed-test-data` - Insert sample test data
- ✅ `DELETE /api/admin/system/reset` - Reset test data

### 18. Test Utilities (Public)
- ✅ `GET /api/test/email` - Send test email

---

## 🎯 Common Use Cases

### Use Case 1: Create a New Member
1. Authenticate (get JWT token)
2. Navigate to **Members** section
3. Click `POST /api/members`
4. Click `Try it out`
5. Fill the request body:
```json
{
  "employerId": 1,
  "companyId": 1,
  "fullName": "Ahmed Ali",
  "civilId": "12345678901",
  "policyNumber": "POL-001",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "phone": "+218912345678",
  "email": "ahmed@example.com",
  "active": true
}
```
6. Click `Execute`
7. Check response (201 Created)

### Use Case 2: Approve a Claim
1. Authenticate
2. Navigate to **Claims Management**
3. Click `POST /api/claims/{id}/approve`
4. Enter claim ID in path parameter
5. Fill request body:
```json
{
  "reviewerId": 1,
  "approvedAmount": 500.00
}
```
6. Click `Execute`

### Use Case 3: List Active Policies
1. Authenticate
2. Navigate to **policy-controller**
3. Click `GET /api/policies/active`
4. Click `Try it out`
5. Click `Execute`
6. View list of active policies

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response:
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2025-11-26T17:00:00Z"
}
```

### Error Response:
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Invalid request payload",
  "timestamp": "2025-11-26T17:00:00Z",
  "path": "/api/members",
  "details": {
    "civilId": "Civil ID is required"
  }
}
```

---

## 🔍 Search & Filter

### Pagination Parameters:
Most list endpoints support:
- `page` - Page number (1-based, default: 1)
- `size` - Page size (default: 10)
- `search` - Search query
- `sortBy` - Sort field (default: createdAt)
- `sortDir` - Sort direction (asc/desc, default: desc)

### Example:
```
GET /api/members?page=1&size=20&search=ahmed&sortBy=fullName&sortDir=asc
```

---

## 🛠️ Advanced Features

### 1. Try It Out
Click "Try it out" on any endpoint to test it directly in the browser.

### 2. Code Generation
Click "Schema" to see request/response models.

### 3. Download OpenAPI Spec
Access the raw OpenAPI specification:
- JSON: `http://localhost:8080/v3/api-docs`
- YAML: `http://localhost:8080/v3/api-docs.yaml`

### 4. Filter by Tag
Use the filter bar at the top to search for specific endpoints.

### 5. Expand/Collapse All
Use the buttons to expand or collapse all sections.

---

## ⚠️ Important Notes

1. **JWT Token Expiry:** Tokens expire after 24 hours. You'll need to login again.

2. **Authorization Required:** Most endpoints require authentication. Don't forget to click "Authorize" first.

3. **Permissions:** Your user account needs proper permissions. The default admin has all permissions.

4. **Date Format:** Use ISO-8601 format: `YYYY-MM-DD` for dates.

5. **HTTP Methods:**
   - GET = Read (no body)
   - POST = Create (with body)
   - PUT = Update (with body)
   - PATCH = Partial update (with body)
   - DELETE = Remove (no body)

---

## 🎉 Ready to Use!

Your Swagger UI is now fully configured and ready to use. Happy testing! 🚀

**Swagger UI:** http://localhost:8080/swagger-ui.html  
**API Docs:** http://localhost:8080/v3/api-docs

**Default Credentials:**
- Username: `admin@tba.sa`
- Password: `Admin@123`
