# TBA-WAAD Frontend - Spring Boot Integration

## Quick Start

This React frontend is now integrated with your Java Spring Boot backend.

### Prerequisites

1. **Backend Running**: Ensure your Spring Boot backend is running on `localhost:8080`
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Node.js**: Version 18 or higher

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## What Changed

### ✅ Backend Integration Complete

1. **API Service Layer** (`/src/services/api.ts`)
   - All API endpoints configured
   - JWT authentication with Bearer tokens
   - Automatic token management
   - Error handling with toast notifications

2. **Authentication** (`/src/contexts/AuthContext.tsx`)
   - Real JWT authentication via `/api/auth/login`
   - Token stored in `localStorage`
   - Automatic token refresh on app load
   - Protected routes

3. **Dashboard** (`/src/components/modules/Dashboard.tsx`)
   - Fetches real data from `/api/dashboard/stats`
   - Displays claims, members, providers stats

4. **Claims Module** (`/src/components/modules/Claims.tsx`)
   - Connected to `/api/claims`
   - Create, read, update operations
   - Status filtering

5. **Environment Configuration** (`.env`)
   - `VITE_API_BASE_URL=http://localhost:8080/api`

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activity` - Recent activity

### Claims
- `GET /api/claims` - List all claims
- `GET /api/claims/{id}` - Get claim details
- `POST /api/claims` - Create new claim
- `PUT /api/claims/{id}` - Update claim
- `DELETE /api/claims/{id}` - Delete claim
- `PATCH /api/claims/{id}/status` - Update claim status

### Members
- `GET /api/members` - List all members
- `POST /api/members` - Create new member
- (Full CRUD operations)

### Providers
- `GET /api/providers` - List all providers
- `POST /api/providers` - Create new provider
- (Full CRUD operations)

### Organizations
- `GET /api/organizations` - List all organizations
- `POST /api/organizations` - Create new organization
- (Full CRUD operations)

### Approvals
- `GET /api/approvals` - List all approvals
- `PATCH /api/approvals/{id}/approve` - Approve request
- `PATCH /api/approvals/{id}/reject` - Reject request
- (Full CRUD operations)

### Finance
- `GET /api/finance/invoices` - List invoices
- `GET /api/finance/settlements` - List settlements
- `POST /api/finance/invoices/{id}/payment` - Process payment

### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports/{id}/export` - Export report

### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/audit-logs` - Get audit logs

## Backend Requirements

Your Spring Boot backend must implement:

### 1. CORS Configuration

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

### 2. JWT Authentication

- Accept `Authorization: Bearer <token>` header
- Return token in login response
- Validate token on protected endpoints
- Implement `/api/auth/me` endpoint

### 3. Response Format

**Login Response:**
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

**Dashboard Stats Response:**
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

## Testing

### 1. Check Backend Connection
Open browser console and try logging in. You should see:
- `POST http://localhost:8080/api/auth/login` with status 200
- Token stored in localStorage under key `auth_token`

### 2. Check API Calls
Navigate to Dashboard. You should see:
- `GET http://localhost:8080/api/dashboard/stats` with status 200
- Stats displayed on dashboard cards

### 3. Check Claims
Navigate to Claims module. You should see:
- `GET http://localhost:8080/api/claims` with status 200
- Claims list populated from backend

## Troubleshooting

### "Network Error" or "Failed to fetch"
- Verify backend is running on port 8080
- Check CORS is enabled in Spring Boot
- Check browser console for detailed error

### "401 Unauthorized"
- Check JWT token is being sent in Authorization header
- Verify token validation in backend
- Check token hasn't expired

### "404 Not Found"
- Verify API endpoints exist in backend
- Check endpoint URLs match between frontend and backend
- Verify Spring Boot controllers are correctly mapped

### Login works but dashboard shows no data
- Check backend returns data in expected format
- Verify `/api/dashboard/stats` endpoint exists
- Check browser console for errors

## File Structure

```
src/
├── services/
│   └── api.ts                 # API service layer (NEW)
├── contexts/
│   └── AuthContext.tsx        # Authentication context (UPDATED)
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx      # Login page (UPDATED)
│   ├── modules/
│   │   ├── Dashboard.tsx      # Dashboard (UPDATED)
│   │   └── Claims.tsx         # Claims module (UPDATED)
│   └── layout/
│       └── MainLayout.tsx     # Main layout with sidebar
└── types/
    └── index.ts               # TypeScript types

.env                            # Environment variables (NEW)
BACKEND_INTEGRATION.md          # Detailed integration docs (NEW)
```

## Next Steps

1. **Test Login**: Try logging in with valid backend credentials
2. **Verify Dashboard**: Check that dashboard stats load from backend
3. **Test Claims**: Try viewing and creating claims
4. **Integrate Other Modules**: Update Members, Providers, Organizations components to use API
5. **Error Handling**: Test error scenarios (invalid credentials, network errors, etc.)
6. **Production Build**: Update `.env` for production API URL

## Development Workflow

When developing new features:

1. **Add API function** in `/src/services/api.ts`
2. **Update component** to use the API function
3. **Add error handling** with try-catch and toast
4. **Test with backend** running

Example:
```typescript
// In api.ts
export const membersApi = {
  async getAll() {
    const response = await fetchWithAuth('/members')
    return response.json()
  }
}

// In component
import { membersApi } from '@/services/api'
import { toast } from 'sonner'

const loadMembers = async () => {
  try {
    const data = await membersApi.getAll()
    setMembers(data)
  } catch (error) {
    toast.error('Failed to load members')
  }
}
```

## Documentation

- **Detailed Integration Guide**: See `BACKEND_INTEGRATION.md`
- **API Service Documentation**: See inline comments in `/src/services/api.ts`
- **Backend Setup**: See `/backend/README.md` (if exists)

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for errors
3. Review `BACKEND_INTEGRATION.md` for troubleshooting
4. Verify CORS configuration
5. Test API endpoints directly with Postman/curl

---

**Status**: ✅ Backend integration complete and ready for testing
