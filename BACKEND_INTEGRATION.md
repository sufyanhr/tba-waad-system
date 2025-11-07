# Backend Integration Guide

This document explains how the React frontend has been integrated with the Spring Boot backend.

## Overview

The frontend now connects to your Java Spring Boot backend running on `localhost:8080`. All authentication and data operations now use RESTful API calls with JWT authentication.

## Configuration

### Environment Variables

The `.env` file contains the API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

You can change this URL to point to different environments (staging, production, etc.).

## API Service Layer

### Location
`/src/services/api.ts`

### Features

1. **Automatic JWT Token Management**
   - Tokens are stored in `localStorage` under the key `auth_token`
   - All API requests automatically include `Authorization: Bearer <token>` header
   - Token is persisted across browser sessions

2. **Error Handling**
   - Custom `ApiError` class with status codes
   - Automatic error responses parsed from backend
   - User-friendly error messages via toast notifications

3. **API Modules**

#### Authentication API (`authApi`)
- `login(email, password)` - POST `/api/auth/login`
- `register(data)` - POST `/api/auth/register`
- `getCurrentUser()` - GET `/api/auth/me`

#### Claims API (`claimsApi`)
- `getAll(params)` - GET `/api/claims`
- `getById(id)` - GET `/api/claims/{id}`
- `create(data)` - POST `/api/claims`
- `update(id, data)` - PUT `/api/claims/{id}`
- `delete(id)` - DELETE `/api/claims/{id}`
- `updateStatus(id, status, notes)` - PATCH `/api/claims/{id}/status`

#### Approvals API (`approvalsApi`)
- `getAll(params)` - GET `/api/approvals`
- `getById(id)` - GET `/api/approvals/{id}`
- `create(data)` - POST `/api/approvals`
- `update(id, data)` - PUT `/api/approvals/{id}`
- `approve(id, notes)` - PATCH `/api/approvals/{id}/approve`
- `reject(id, notes)` - PATCH `/api/approvals/{id}/reject`

#### Members API (`membersApi`)
- `getAll(params)` - GET `/api/members`
- `getById(id)` - GET `/api/members/{id}`
- `create(data)` - POST `/api/members`
- `update(id, data)` - PUT `/api/members/{id}`
- `delete(id)` - DELETE `/api/members/{id}`

#### Providers API (`providersApi`)
- `getAll(params)` - GET `/api/providers`
- `getById(id)` - GET `/api/providers/{id}`
- `create(data)` - POST `/api/providers`
- `update(id, data)` - PUT `/api/providers/{id}`
- `delete(id)` - DELETE `/api/providers/{id}`

#### Organizations API (`organizationsApi`)
- `getAll(params)` - GET `/api/organizations`
- `getById(id)` - GET `/api/organizations/{id}`
- `create(data)` - POST `/api/organizations`
- `update(id, data)` - PUT `/api/organizations/{id}`
- `delete(id)` - DELETE `/api/organizations/{id}`

#### Finance API (`financeApi`)
- `getInvoices(params)` - GET `/api/finance/invoices`
- `getSettlements(params)` - GET `/api/finance/settlements`
- `createInvoice(data)` - POST `/api/finance/invoices`
- `processPayment(invoiceId, data)` - POST `/api/finance/invoices/{id}/payment`

#### Reports API (`reportsApi`)
- `generate(params)` - POST `/api/reports/generate`
- `export(reportId, format)` - GET `/api/reports/{id}/export?format={format}`

#### Dashboard API (`dashboardApi`)
- `getStats()` - GET `/api/dashboard/stats`
- `getRecentActivity()` - GET `/api/dashboard/activity`

#### Settings API (`settingsApi`)
- `getSettings()` - GET `/api/settings`
- `updateSettings(data)` - PUT `/api/settings`
- `getAuditLogs(params)` - GET `/api/settings/audit-logs`

## Authentication Flow

### 1. Login Process

```typescript
// User enters credentials in LoginPage
const success = await login(email, password)

// AuthContext handles the API call
const response = await authApi.login(email, password)

// If successful, token is stored
localStorage.setItem('auth_token', response.token)

// User data is stored in state
setUser(response.user)

// User is redirected to dashboard
```

### 2. Token Persistence

- On app load, `AuthContext` checks for existing token in localStorage
- If found, attempts to fetch current user data from `/api/auth/me`
- If successful, user remains logged in
- If failed, token is removed and user must login again

### 3. Logout Process

```typescript
// Remove token from localStorage
localStorage.removeItem('auth_token')

// Clear user state
setUser(null)

// User is redirected to login page
```

## Updated Components

### 1. AuthContext (`/src/contexts/AuthContext.tsx`)
- Now uses `localStorage` for token persistence (replaced Spark KV)
- Calls real backend API endpoints
- Handles loading state for token validation
- Provides toast notifications for auth events

### 2. Dashboard (`/src/components/modules/Dashboard.tsx`)
- **Primary Data Source**: Fetches comprehensive stats from `/api/dashboard/stats`
- **Fallback Data Source**: If dashboard stats endpoint fails, aggregates data from:
  - `/api/claims` - Total claims, pending, approved counts
  - `/api/approvals` - Pending approvals count
  - `/api/members` - Total members count
  - `/api/providers` - Active providers count
- **Visualizations**: 
  - Displays 8 stat cards (Total Claims, Pending Claims, Approved Claims, Pending Approvals, Active Members, Active Providers, Total Amount, Overdue Invoices)
  - Shows pie chart of Claims Distribution (Pending, Approved, Rejected) using Recharts
  - Role-based visibility for stats and charts
- **Error Handling**:
  - Displays error messages on API failure
  - Automatically redirects to login on 401 (invalid JWT token)
  - Shows loading state with skeleton cards while fetching
- **Features**:
  - Currency formatting for financial data
  - Color-coded status indicators
  - Responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)

### 3. Claims (`/src/components/modules/Claims.tsx`)
- Fetches claims from `/api/claims`
- Creates/updates claims via API
- Supports filtering by status
- Handles paginated responses

### 4. LoginPage (`/src/components/auth/LoginPage.tsx`)
- Updated to work with real backend authentication
- Removed demo account information

### 5. App.tsx
- Added loading state handling
- Shows loading spinner while authenticating

## CORS Configuration Required

Your Spring Boot backend must have CORS enabled to accept requests from the React frontend. Add this configuration:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Expected Backend Response Formats

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "admin@waad.com",
    "name": "Admin User",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Dashboard Stats Response
```json
{
  "totalClaims": 150,
  "pendingClaims": 25,
  "approvedClaims": 100,
  "totalAmount": 500000,
  "totalMembers": 500,
  "activeProviders": 50,
  "pendingApprovals": 15,
  "overdueInvoices": 5
}
```

### Claims List Response
The dashboard now supports both array and paginated response formats:

**Option 1: Simple Array**
```json
[
  {
    "id": "claim-123",
    "claimNumber": "CLM-2024-001",
    "memberId": "member-456",
    "memberName": "John Doe",
    "providerId": "provider-789",
    "providerName": "City Hospital",
    "serviceDate": "2024-01-15",
    "submissionDate": "2024-01-16",
    "amount": 5000,
    "approvedAmount": 4500,
    "status": "APPROVED",
    "diagnosis": "Routine checkup",
    "treatment": "Physical examination",
    "documents": [],
    "reviewNotes": "Approved for payment"
  }
]
```

**Option 2: Paginated Response**
```json
{
  "content": [...],
  "totalElements": 150,
  "totalPages": 15,
  "size": 10,
  "number": 0
}
```

## Testing the Integration

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```

Backend should be running on `http://localhost:8080`

### 2. Start the Frontend
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Test Login
1. Navigate to `http://localhost:5173`
2. Enter valid credentials from your backend database
3. Click "Sign In"
4. If successful, you should see the dashboard with data from backend

### 4. Check Browser Console
- Open browser DevTools (F12)
- Check Console for any errors
- Check Network tab to see API requests
- Verify requests have `Authorization` header with Bearer token

## Troubleshooting

### Issue: CORS Error
**Solution**: Ensure CORS is properly configured in Spring Boot (see above)

### Issue: 401 Unauthorized
**Solution**: 
- Check that JWT token is being sent in Authorization header
- Verify token is not expired
- Check backend JWT validation logic

### Issue: Cannot connect to backend
**Solution**:
- Verify backend is running on port 8080
- Check `.env` file has correct URL
- Restart frontend after changing `.env`

### Issue: Login fails with valid credentials
**Solution**:
- Check backend console for errors
- Verify user exists in database
- Check password encryption matches

### Issue: Token not persisting after refresh
**Solution**:
- Check browser localStorage has `auth_token` key
- Verify `/api/auth/me` endpoint works
- Check JWT token expiration time

## Next Steps

To integrate other modules (Members, Providers, Organizations, etc.):

1. Update the respective component to import API service:
   ```typescript
   import { membersApi } from '@/services/api'
   ```

2. Replace local data fetching with API calls:
   ```typescript
   const members = await membersApi.getAll()
   ```

3. Handle errors with try-catch and toast:
   ```typescript
   try {
     await membersApi.create(data)
     toast.success('Member created')
   } catch (error) {
     toast.error('Failed to create member')
   }
   ```

4. Test each module individually

## Security Considerations

1. **Never commit tokens**: `.env` is in `.gitignore`
2. **Token expiration**: Implement token refresh logic if needed
3. **HTTPS in production**: Always use HTTPS for production
4. **XSS protection**: React escapes content by default
5. **CSRF**: Not needed for JWT-based auth
6. **Input validation**: Always validate user input on backend

## Summary

The frontend is now fully integrated with your Spring Boot backend. All authentication uses JWT tokens stored in localStorage, and all data operations use RESTful API calls. The API service layer (`/src/services/api.ts`) provides a clean interface for all backend operations.
