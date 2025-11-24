# Employers Module - Quick Start Guide

## 🚀 Quick Access

### URLs
- **Frontend:** http://localhost:3000/tba/employers
- **Backend API:** http://localhost:8080/api/employers
- **API Docs (Swagger):** http://localhost:8080/swagger-ui.html

### Login Credentials
```
Email: admin@tba.sa
Password: Admin@123
```

---

## 🎯 Testing the Frontend UI

### Step 1: Login
1. Open http://localhost:3000
2. Enter credentials: `admin@tba.sa` / `Admin@123`
3. Click "Sign In"

### Step 2: Navigate to Employers
1. After login, look for **"Employers"** in the left sidebar menu
2. Click on "Employers" (🏢 icon)
3. You should see the Employers List page

### Step 3: Test CREATE
1. Click the **"+ New Employer"** button (top-right)
2. Fill in the form:
   - **Name:** Test Company Inc
   - **Code:** TEST001 (must be unique)
   - **Company:** Select from dropdown
   - **Address:** 123 Test Street
   - **Phone:** +966501234567
   - **Email:** test@company.com
   - **Contact Name:** John Doe
   - **Contact Phone:** +966509876543
   - **Contact Email:** john@company.com
   - **Active:** Check the checkbox
3. Click **"Create"**
4. You should be redirected to the list with a success message

### Step 4: Test VIEW
1. In the employers list, find your newly created employer
2. Click the **👁️ (eye icon)** in the Actions column
3. Verify all fields are displayed correctly
4. Click **"Edit"** or **"Back"** button

### Step 5: Test EDIT
1. From the list, click the **✏️ (pencil icon)** in Actions column
2. Modify some fields (e.g., change address or phone)
3. Click **"Update"**
4. Verify the changes are reflected in the list

### Step 6: Test SEARCH
1. In the list page, use the **Search** input at the top
2. Type part of an employer name or code
3. Table should filter results in real-time

### Step 7: Test COMPANY FILTER (Super Admin Only)
1. If logged in as Super Admin, you'll see a **"Company"** dropdown
2. Select a specific company
3. Table should show only employers from that company

### Step 8: Test DELETE
1. Click the **🗑️ (trash icon)** in Actions column
2. Confirm the deletion in the dialog
3. Employer should be removed from the list

---

## 🧪 Testing the Backend API

### Using cURL (Command Line)

#### 1. Login to get JWT token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tba.sa","password":"Admin@123"}'
```

Copy the `token` from the response.

#### 2. Create Employer
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/employers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "My Test Company",
    "code": "MTC001",
    "companyId": 1,
    "address": "123 Main Street",
    "phone": "+966501234567",
    "email": "info@test.com",
    "contactName": "Jane Doe",
    "contactPhone": "+966509876543",
    "contactEmail": "jane@test.com",
    "active": true
  }'
```

#### 3. Get All Employers
```bash
curl "http://localhost:8080/api/employers?page=1&size=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Get Employer by ID
```bash
curl "http://localhost:8080/api/employers/1" \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Update Employer
```bash
curl -X PUT http://localhost:8080/api/employers/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "My Test Company UPDATED",
    "code": "MTC001",
    "companyId": 1,
    "address": "456 New Address",
    "phone": "+966507777777",
    "email": "updated@test.com",
    "contactName": "Jane Doe",
    "contactPhone": "+966509876543",
    "contactEmail": "jane@test.com",
    "active": true
  }'
```

#### 6. Filter by Company
```bash
curl "http://localhost:8080/api/employers?companyId=1" \
  -H "Authorization: Bearer $TOKEN"
```

#### 7. Search Employers
```bash
curl "http://localhost:8080/api/employers?search=Test" \
  -H "Authorization: Bearer $TOKEN"
```

#### 8. Delete Employer
```bash
curl -X DELETE "http://localhost:8080/api/employers/1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Using the Test Script

We've created a comprehensive test script that runs all CRUD operations:

```bash
cd /workspaces/tba-waad-system/backend
./test-employers-crud.sh
```

This will test:
- ✅ Create employer
- ✅ Get by ID
- ✅ Get paginated list
- ✅ Update employer
- ✅ Company filtering
- ✅ Search functionality
- ✅ Delete employer
- ✅ Unique code validation
- ✅ Count endpoint

---

## 📊 Expected Responses

### Successful Create
```json
{
  "status": "success",
  "message": "Employer created successfully",
  "data": {
    "id": 1,
    "name": "My Test Company",
    "code": "MTC001",
    "companyId": 1,
    "contactName": "Jane Doe",
    "contactPhone": "+966509876543",
    "contactEmail": "jane@test.com",
    "address": "123 Main Street",
    "phone": "+966501234567",
    "email": "info@test.com",
    "active": true,
    "createdAt": "2025-11-24T22:00:00",
    "updatedAt": "2025-11-24T22:00:00"
  },
  "timestamp": "2025-11-24T22:00:00Z"
}
```

### Paginated List
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "My Test Company",
        "code": "MTC001",
        "companyId": 1,
        ...
      }
    ],
    "total": 1,
    "page": 1,
    "size": 10
  },
  "timestamp": "2025-11-24T22:00:00"
}
```

### Error - Duplicate Code
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Employer code already exists: MTC001",
  "timestamp": "2025-11-24T22:00:00Z",
  "path": "/api/employers",
  "details": null
}
```

### Error - Not Found
```json
{
  "status": "error",
  "code": "EMPLOYER_NOT_FOUND",
  "message": "Employer not found with id: '999'",
  "timestamp": "2025-11-24T22:00:00Z",
  "path": "/api/employers/999",
  "details": null
}
```

---

## 🔍 Verification Checklist

After testing, verify these features work:

### Frontend UI
- [ ] Can login with admin credentials
- [ ] Employers menu appears in sidebar
- [ ] List page displays with table
- [ ] Can create new employer with all fields
- [ ] Can view employer details (read-only)
- [ ] Can edit existing employer
- [ ] Can delete employer with confirmation
- [ ] Search filters results in real-time
- [ ] Company filter (for Super Admin) works
- [ ] Pagination controls work
- [ ] Success/error toast messages appear
- [ ] Form validation prevents empty required fields

### Backend API
- [ ] All endpoints return 401 without JWT token
- [ ] All endpoints accept valid JWT token
- [ ] POST creates employer and returns ID
- [ ] GET list returns paginated results
- [ ] GET by ID returns single employer
- [ ] PUT updates employer successfully
- [ ] DELETE removes employer
- [ ] Company filter (`?companyId=X`) works
- [ ] Search filter (`?search=X`) works
- [ ] Duplicate code returns validation error
- [ ] Invalid ID returns 404 error

### Security & Permissions
- [ ] MANAGE_EMPLOYERS permission required
- [ ] JWT token validated on every request
- [ ] Unauthorized users cannot access
- [ ] Menu hidden for users without permission
- [ ] Routes protected by RBACGuard

---

## 🐛 Troubleshooting

### Issue: "Cannot access /tba/employers"
- **Solution:** Make sure you're logged in and have MANAGE_EMPLOYERS permission
- Verify: Login as `admin@tba.sa` (Super Admin has all permissions)

### Issue: "Network Error" on API calls
- **Solution:** Check backend is running: `lsof -ti:8080`
- Start backend: `cd backend && mvn spring-boot:run`

### Issue: "JWT token expired"
- **Solution:** Logout and login again to get new token
- Token expires after 24 hours

### Issue: "Employer code already exists"
- **Solution:** This is expected! Code must be unique. Use different code like TEST002, TEST003

### Issue: Frontend shows blank page
- **Solution:** Check frontend is running: `lsof -ti:3000`
- Start frontend: `cd frontend && npm run dev`
- Check browser console for errors (F12)

---

## 📚 Additional Resources

- **Full Implementation Report:** `/EMPLOYERS_MODULE_COMPLETION_REPORT.md`
- **Backend API Docs:** http://localhost:8080/swagger-ui.html
- **Test Script:** `/backend/test-employers-crud.sh`

---

## ✅ Success Indicators

You'll know the module is working when:

1. ✅ You can create an employer through the UI
2. ✅ The employer appears in the list immediately
3. ✅ You can search and filter employers
4. ✅ Editing saves changes successfully
5. ✅ Deleting removes the employer
6. ✅ Trying duplicate codes shows error message
7. ✅ All API calls return proper JSON responses
8. ✅ Pagination shows correct page numbers

---

**Need Help?** Check the logs:
- Backend: `tail -f /tmp/backend.log`
- Frontend: Browser console (F12 → Console tab)

**Status Check:**
```bash
# Check both services
echo "Backend:" && lsof -ti:8080 && echo "✅ Running" || echo "❌ Not running"
echo "Frontend:" && lsof -ti:3000 && echo "✅ Running" || echo "❌ Not running"
```
