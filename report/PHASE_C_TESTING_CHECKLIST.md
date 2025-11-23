# 📋 PHASE C Testing Checklist

**Project**: TBA WAAD System - Backend Integration  
**Phase**: C - API Integration  
**Backend URL**: http://localhost:9092/api  
**Frontend URL**: http://localhost:3000  

---

## Pre-Testing Requirements

### ✅ Backend Setup
- [ ] Backend is running on port 9092
- [ ] Database is initialized with test data
- [ ] Test user exists: `admin@tba.sa / admin123`
- [ ] Verify backend health: `curl http://localhost:9092/actuator/health`

### ✅ Frontend Setup
- [ ] Frontend running on port 3000
- [ ] `.env` file created with `VITE_API_BASE_URL=http://localhost:9092/api`
- [ ] Dependencies installed: `npm install`
- [ ] Build successful: `npm run build`
- [ ] Dev server started: `npm run start`

---

## 1. Authentication & Authorization

### 1.1 Login Flow
**Endpoint**: `POST /auth/login`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1.1.1 | Navigate to `/auth/login` | Login page loads | [ ] |
| 1.1.2 | Enter `admin@tba.sa / admin123` | Fields populate | [ ] |
| 1.1.3 | Click "Login" button | Toast shows "Login successful!" | [ ] |
| 1.1.4 | Check redirect | Redirects to `/dashboard/default` | [ ] |
| 1.1.5 | Check localStorage | `accessToken` exists | [ ] |
| 1.1.6 | Check user info | Sidebar shows username | [ ] |

**Notes**: ___________________________________________

---

### 1.2 Failed Login
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1.2.1 | Enter invalid email | Shows validation error | [ ] |
| 1.2.2 | Enter wrong password | Shows "Invalid credentials" | [ ] |
| 1.2.3 | Click login with empty fields | Shows required field errors | [ ] |

**Notes**: ___________________________________________

---

### 1.3 Token Refresh
**Endpoint**: `POST /auth/refresh`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1.3.1 | Log in successfully | Token stored | [ ] |
| 1.3.2 | Wait for token expiry (or manually expire) | - | [ ] |
| 1.3.3 | Navigate to `/tba/claims` | Auto-refresh triggers | [ ] |
| 1.3.4 | Check network tab | See POST /auth/refresh | [ ] |
| 1.3.5 | Check localStorage | New token stored | [ ] |
| 1.3.6 | Verify page loads | Claims page loads successfully | [ ] |

**Notes**: ___________________________________________

---

### 1.4 Auto-Redirect on 401
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1.4.1 | Manually remove `accessToken` from localStorage | - | [ ] |
| 1.4.2 | Navigate to `/tba/claims` | Auto-redirect to `/auth/login` | [ ] |
| 1.4.3 | Login again | Redirect back to protected page | [ ] |

**Notes**: ___________________________________________

---

### 1.5 Logout
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1.5.1 | Click logout button (if available) | - | [ ] |
| 1.5.2 | Check redirect | Redirects to `/auth/login` | [ ] |
| 1.5.3 | Check localStorage | `accessToken` cleared | [ ] |
| 1.5.4 | Try accessing `/tba/claims` | Redirects to login | [ ] |

**Notes**: ___________________________________________

---

## 2. RBAC & Permissions

### 2.1 Permission-Based Access
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 2.1.1 | Login with user having `claims.view` | - | [ ] |
| 2.1.2 | Navigate to `/tba/claims` | Page loads successfully | [ ] |
| 2.1.3 | Logout and login with user WITHOUT `claims.view` | - | [ ] |
| 2.1.4 | Navigate to `/tba/claims` | Shows "Access Denied" message | [ ] |
| 2.1.5 | Check error message | Shows required permission: `claims.view` | [ ] |

**Test Users Required**:
- User with `claims.view`: ___________
- User without `claims.view`: ___________

**Notes**: ___________________________________________

---

### 2.2 ProtectedRoute Component
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 2.2.1 | Access route with `requiredPermissions={['claims.create']}` | - | [ ] |
| 2.2.2 | Without permission | Shows 403 Access Denied page | [ ] |
| 2.2.3 | Click "Go to Dashboard" button | Navigates to dashboard | [ ] |
| 2.2.4 | With permission | Page loads normally | [ ] |

**Notes**: ___________________________________________

---

### 2.3 Role-Based Access
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 2.3.1 | Login as ADMIN role | - | [ ] |
| 2.3.2 | Check `useAuth().hasRole('ADMIN')` | Returns `true` | [ ] |
| 2.3.3 | Login as USER role | - | [ ] |
| 2.3.4 | Check `useAuth().hasRole('ADMIN')` | Returns `false` | [ ] |

**Notes**: ___________________________________________

---

## 3. TBA CRUD Operations

### 3.1 Claims Module
**Endpoints**: `/claims`, `/claims/{id}`, `/claims/stats`

#### GET All Claims
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.1.1 | Navigate to `/tba/claims` | Table loads | [ ] |
| 3.1.2 | Check data source | Shows real backend data (not mock) | [ ] |
| 3.1.3 | Check pagination | Pagination controls visible | [ ] |
| 3.1.4 | Click next page | Loads next set of records | [ ] |
| 3.1.5 | Use search filter | Filters records correctly | [ ] |

**Sample Record Count**: ___________

---

#### CREATE Claim
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.1.6 | Click "Add Claim" button | Drawer opens | [ ] |
| 3.1.7 | Fill all required fields | - | [ ] |
| 3.1.8 | Click "Save" button | POST request sent | [ ] |
| 3.1.9 | Check toast notification | Shows "Created successfully" | [ ] |
| 3.1.10 | Check table | New record appears | [ ] |
| 3.1.11 | Check backend database | Record exists | [ ] |

**New Claim ID**: ___________

---

#### UPDATE Claim
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.1.12 | Click "Edit" icon on a claim | Drawer opens with data | [ ] |
| 3.1.13 | Modify some fields | - | [ ] |
| 3.1.14 | Click "Save" button | PUT request sent | [ ] |
| 3.1.15 | Check toast | Shows "Updated successfully" | [ ] |
| 3.1.16 | Check table | Shows updated data | [ ] |
| 3.1.17 | Check backend database | Data updated | [ ] |

**Updated Claim ID**: ___________

---

#### DELETE Claim
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.1.18 | Click "Delete" icon on a claim | Confirmation dialog appears | [ ] |
| 3.1.19 | Confirm deletion | DELETE request sent | [ ] |
| 3.1.20 | Check toast | Shows "Deleted successfully" | [ ] |
| 3.1.21 | Check table | Record removed | [ ] |
| 3.1.22 | Check backend database | Record deleted | [ ] |

**Deleted Claim ID**: ___________

**Notes**: ___________________________________________

---

### 3.2 Members Module
**Endpoints**: `/members`, `/members/{id}`, `/members/stats`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.2.1 | Navigate to `/tba/members` | Table loads with real data | [ ] |
| 3.2.2 | Create new member | POST successful, toast shown | [ ] |
| 3.2.3 | Update member | PUT successful, data updated | [ ] |
| 3.2.4 | Delete member | DELETE successful, removed from table | [ ] |
| 3.2.5 | Check stats API | GET /members/stats returns data | [ ] |

**Notes**: ___________________________________________

---

### 3.3 Employers Module
**Endpoints**: `/employers`, `/employers/{id}`, `/employers/stats`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.3.1 | Navigate to `/tba/employers` | Table loads with real data | [ ] |
| 3.3.2 | Create new employer | POST successful | [ ] |
| 3.3.3 | Update employer | PUT successful | [ ] |
| 3.3.4 | Delete employer | DELETE successful | [ ] |
| 3.3.5 | Check stats API | GET /employers/stats returns data | [ ] |

**Notes**: ___________________________________________

---

### 3.4 Insurance Companies Module
**Endpoints**: `/insurance-companies`, `/insurance-companies/{id}`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.4.1 | Navigate to `/tba/insurance-companies` | Table loads | [ ] |
| 3.4.2 | Create new company | POST successful | [ ] |
| 3.4.3 | Update company | PUT successful | [ ] |
| 3.4.4 | Delete company | DELETE successful | [ ] |

**Notes**: ___________________________________________

---

### 3.5 Reviewer Companies Module
**Endpoints**: `/reviewer-companies`, `/reviewer-companies/{id}`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.5.1 | Navigate to `/tba/reviewer-companies` | Table loads | [ ] |
| 3.5.2 | Create new company | POST successful | [ ] |
| 3.5.3 | Update company | PUT successful | [ ] |
| 3.5.4 | Delete company | DELETE successful | [ ] |

**Notes**: ___________________________________________

---

### 3.6 Visits Module
**Endpoints**: `/visits`, `/visits/{id}`, `/visits/stats`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.6.1 | Navigate to `/tba/visits` | Table loads | [ ] |
| 3.6.2 | Create new visit | POST successful | [ ] |
| 3.6.3 | Update visit | PUT successful | [ ] |
| 3.6.4 | Delete visit | DELETE successful | [ ] |
| 3.6.5 | Check stats API | GET /visits/stats returns data | [ ] |

**Notes**: ___________________________________________

---

## 4. User Profile API

### 4.1 Get Profile
**Endpoint**: `GET /users/me`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 4.1.1 | Call `userProfileApi.getProfile()` | Returns user object | [ ] |
| 4.1.2 | Check user.email | Matches logged-in user | [ ] |
| 4.1.3 | Check user.permissions | Array of permissions | [ ] |
| 4.1.4 | Check user.roles | Array of roles | [ ] |

**Notes**: ___________________________________________

---

### 4.2 Update Profile
**Endpoint**: `PUT /users/me`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 4.2.1 | Call `userProfileApi.updateProfile({name: 'New Name'})` | PUT successful | [ ] |
| 4.2.2 | Call `getProfile()` again | Shows updated name | [ ] |
| 4.2.3 | Check backend database | Name updated | [ ] |

**Notes**: ___________________________________________

---

### 4.3 Change Password
**Endpoint**: `PUT /users/me/password`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 4.3.1 | Call `userProfileApi.changePassword({oldPassword, newPassword})` | PUT successful | [ ] |
| 4.3.2 | Logout and login with old password | Login fails | [ ] |
| 4.3.3 | Login with new password | Login successful | [ ] |

**Notes**: ___________________________________________

---

### 4.4 Upload Avatar
**Endpoint**: `POST /users/me/avatar`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 4.4.1 | Select image file | - | [ ] |
| 4.4.2 | Call `userProfileApi.uploadAvatar(file)` | POST with multipart/form-data | [ ] |
| 4.4.3 | Check response | Returns avatar URL | [ ] |
| 4.4.4 | Display avatar | Image shows in UI | [ ] |

**Notes**: ___________________________________________

---

## 5. File Upload API

### 5.1 Single File Upload
**Endpoint**: `POST /files/upload`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 5.1.1 | Select file from disk | - | [ ] |
| 5.1.2 | Call `filesApi.upload(file)` | POST with FormData | [ ] |
| 5.1.3 | Check response | Returns { filename, url, size } | [ ] |
| 5.1.4 | Open returned URL | File is accessible | [ ] |

**Uploaded File**: ___________

---

### 5.2 Multiple File Upload
**Endpoint**: `POST /files/upload/multiple`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 5.2.1 | Select multiple files | - | [ ] |
| 5.2.2 | Call `filesApi.uploadMultiple(files)` | POST with FormData | [ ] |
| 5.2.3 | Check response | Returns array of file objects | [ ] |
| 5.2.4 | Verify all files uploaded | All URLs accessible | [ ] |

**Files Uploaded**: ___________

---

### 5.3 File Download
**Endpoint**: `GET /files/{filename}/download`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 5.3.1 | Call `filesApi.download(filename)` | GET with responseType: 'blob' | [ ] |
| 5.3.2 | Check response | Returns Blob object | [ ] |
| 5.3.3 | Trigger download | Browser downloads file | [ ] |

**Notes**: ___________________________________________

---

### 5.4 File Deletion
**Endpoint**: `DELETE /files/{filename}`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 5.4.1 | Call `filesApi.delete(filename)` | DELETE successful | [ ] |
| 5.4.2 | Try accessing file URL | Returns 404 | [ ] |

**Notes**: ___________________________________________

---

## 6. Reports API

### 6.1 Dashboard Statistics
**Endpoint**: `GET /reports/dashboard`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 6.1.1 | Call `reportsApi.getDashboardStats()` | GET successful | [ ] |
| 6.1.2 | Check response structure | Contains totalClaims, totalMembers, etc. | [ ] |
| 6.1.3 | Verify data matches database | Numbers are correct | [ ] |

**Sample Response**:
```json
{
  "totalClaims": ___,
  "totalMembers": ___,
  "totalEmployers": ___
}
```

---

### 6.2 Claims Statistics
**Endpoint**: `GET /reports/claims`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 6.2.1 | Call `reportsApi.getClaimsStats()` | GET successful | [ ] |
| 6.2.2 | Check claims by status | Returns pending, approved, rejected | [ ] |
| 6.2.3 | Check totals | Sum matches total claims | [ ] |

**Notes**: ___________________________________________

---

### 6.3 Export to Excel
**Endpoint**: `GET /reports/{type}/export/excel`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 6.3.1 | Call `reportsApi.exportToExcel('claims')` | GET with responseType: 'blob' | [ ] |
| 6.3.2 | Check content-type | application/vnd.openxmlformats... | [ ] |
| 6.3.3 | Download and open file | Excel file opens correctly | [ ] |

**Notes**: ___________________________________________

---

### 6.4 Export to PDF
**Endpoint**: `GET /reports/{type}/export/pdf`

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 6.4.1 | Call `reportsApi.exportToPDF('claims')` | GET with responseType: 'blob' | [ ] |
| 6.4.2 | Check content-type | application/pdf | [ ] |
| 6.4.3 | Open PDF | PDF displays correctly | [ ] |

**Notes**: ___________________________________________

---

## 7. Error Handling

### 7.1 Network Errors
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 7.1.1 | Stop backend server | - | [ ] |
| 7.1.2 | Try logging in | Shows network error message | [ ] |
| 7.1.3 | Check console | Logs "Network error or timeout" | [ ] |
| 7.1.4 | Restart backend | - | [ ] |
| 7.1.5 | Try logging in again | Login successful | [ ] |

**Notes**: ___________________________________________

---

### 7.2 404 Not Found
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 7.2.1 | Call non-existent endpoint `/api/nonexistent` | - | [ ] |
| 7.2.2 | Check console | Logs "Resource not found" | [ ] |
| 7.2.3 | Check UI | Shows error toast (if applicable) | [ ] |

**Notes**: ___________________________________________

---

### 7.3 500 Server Error
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 7.3.1 | Simulate 500 error in backend | - | [ ] |
| 7.3.2 | Make API call | - | [ ] |
| 7.3.3 | Check console | Logs "Server error" | [ ] |
| 7.3.4 | Check UI | Shows error message to user | [ ] |

**Notes**: ___________________________________________

---

### 7.4 403 Forbidden
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 7.4.1 | Login with restricted user | - | [ ] |
| 7.4.2 | Try accessing forbidden resource | - | [ ] |
| 7.4.3 | Check response | 403 Forbidden | [ ] |
| 7.4.4 | Check UI | Shows "Access Denied" or similar | [ ] |

**Notes**: ___________________________________________

---

## 8. Performance Testing

### 8.1 Page Load Times
| Page | Load Time | Status |
|------|-----------|--------|
| `/auth/login` | ___ ms | [ ] |
| `/dashboard/default` | ___ ms | [ ] |
| `/tba/claims` | ___ ms | [ ] |
| `/tba/members` | ___ ms | [ ] |

**Acceptable**: < 3 seconds

---

### 8.2 API Response Times
| Endpoint | Response Time | Status |
|----------|---------------|--------|
| `POST /auth/login` | ___ ms | [ ] |
| `GET /claims` | ___ ms | [ ] |
| `GET /members` | ___ ms | [ ] |
| `GET /users/me` | ___ ms | [ ] |

**Acceptable**: < 1 second

---

## 9. Security Testing

### 9.1 Token Security
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 9.1.1 | Inspect JWT token | Contains user ID, email, roles | [ ] |
| 9.1.2 | Check token expiration | Has exp claim | [ ] |
| 9.1.3 | Try using expired token | Returns 401 | [ ] |
| 9.1.4 | Try modifying token | Returns 401 | [ ] |

**Notes**: ___________________________________________

---

### 9.2 Authorization
| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 9.2.1 | Copy valid token | - | [ ] |
| 9.2.2 | Use token for unauthorized action | Returns 403 | [ ] |
| 9.2.3 | Verify permissions checked server-side | Not just frontend | [ ] |

**Notes**: ___________________________________________

---

## 10. Cross-Browser Testing

### 10.1 Browser Compatibility
| Browser | Version | Login | CRUD | RBAC | Status |
|---------|---------|-------|------|------|--------|
| Chrome | ___ | [ ] | [ ] | [ ] | [ ] |
| Firefox | ___ | [ ] | [ ] | [ ] | [ ] |
| Safari | ___ | [ ] | [ ] | [ ] | [ ] |
| Edge | ___ | [ ] | [ ] | [ ] | [ ] |

**Notes**: ___________________________________________

---

## Summary

### Test Results Overview
| Category | Total Tests | Passed | Failed | Skipped |
|----------|-------------|--------|--------|---------|
| Authentication | ___ | ___ | ___ | ___ |
| RBAC | ___ | ___ | ___ | ___ |
| Claims CRUD | ___ | ___ | ___ | ___ |
| Members CRUD | ___ | ___ | ___ | ___ |
| Employers CRUD | ___ | ___ | ___ | ___ |
| Insurance CRUD | ___ | ___ | ___ | ___ |
| Reviewers CRUD | ___ | ___ | ___ | ___ |
| Visits CRUD | ___ | ___ | ___ | ___ |
| User Profile | ___ | ___ | ___ | ___ |
| File Upload | ___ | ___ | ___ | ___ |
| Reports | ___ | ___ | ___ | ___ |
| Error Handling | ___ | ___ | ___ | ___ |
| Performance | ___ | ___ | ___ | ___ |
| Security | ___ | ___ | ___ | ___ |
| **TOTAL** | **___** | **___** | **___** | **___** |

---

## Critical Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

---

## Non-Critical Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

---

## Recommendations
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

---

## Sign-Off

**Tester Name**: ___________________  
**Date**: ___________________  
**Overall Status**: [ ] Passed  [ ] Failed  [ ] Needs Revision  

**Comments**: 
___________________________________________
___________________________________________
___________________________________________

---

**Phase**: C - Backend Integration  
**Version**: 1.0  
**Last Updated**: 2025-11-21
