# TBA-WAAD Backend API - Phase B4 Implementation

## 🎯 Overview
Complete, production-ready Spring Boot 3.2 + Java 21 backend API for TBA-WAAD Insurance System.

## 📦 Technology Stack
- **Java**: 21
- **Spring Boot**: 3.2.5
- **Database**: H2 (dev), PostgreSQL (production)
- **Security**: Spring Security + JWT
- **Build Tool**: Maven 3.9
- **Documentation**: Swagger/OpenAPI 3.0

## 🏗️ Architecture

### Project Structure
```
src/main/java/com/waad/tba/
├── TbaWaadApplication.java         # Main application entry point
├── common/
│   ├── dto/
│   │   └── ApiResponse.java        # Standardized API response wrapper
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       └── ResourceNotFoundException.java
├── config/
│   ├── CorsConfig.java             # CORS configuration
│   └── DataInitializer.java       # Seeds initial data
├── security/
│   ├── JwtTokenProvider.java      # JWT token generation/validation
│   ├── JwtAuthenticationFilter.java
│   └── SecurityConfig.java         # Spring Security configuration
└── modules/
    ├── auth/                       # Authentication Module
    │   ├── controller/
    │   ├── service/
    │   └── dto/
    ├── rbac/                       # Role-Based Access Control
    │   ├── entity/
    │   ├── repository/
    │   ├── dto/
    │   ├── mapper/
    │   ├── service/
    │   └── controller/
    ├── insurance/                  # Insurance Companies
    ├── reviewer/                   # Reviewer Companies
    ├── employer/                   # Employers
    ├── member/                     # Members
    ├── claim/                      # Claims
    ├── visit/                      # Visits
    └── dashboard/                  # Dashboard & Analytics
```

## 🚀 Quick Start

### Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL (for production)

### Running the Application

```bash
# Clone the repository
cd /workspaces/tba-waad-system/backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on **http://localhost:9090**

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

### RBAC (`/api/admin`)
#### Users
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{id}` - Get user by ID
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `POST /api/admin/users/{id}/assign-roles` - Assign roles to user

#### Roles
- `GET /api/admin/roles` - List all roles
- `GET /api/admin/roles/{id}` - Get role by ID
- `POST /api/admin/roles` - Create role
- `PUT /api/admin/roles/{id}` - Update role
- `DELETE /api/admin/roles/{id}` - Delete role
- `POST /api/admin/roles/{id}/assign-permissions` - Assign permissions to role

#### Permissions
- `GET /api/admin/permissions` - List all permissions
- `GET /api/admin/permissions/{id}` - Get permission by ID
- `POST /api/admin/permissions` - Create permission
- `PUT /api/admin/permissions/{id}` - Update permission
- `DELETE /api/admin/permissions/{id}` - Delete permission

### Insurance Companies (`/api/insurance-companies`)
- `GET /api/insurance-companies/all` - List all
- `GET /api/insurance-companies/{id}` - Get by ID
- `POST /api/insurance-companies` - Create
- `PUT /api/insurance-companies/{id}` - Update
- `DELETE /api/insurance-companies/{id}` - Delete
- `GET /api/insurance-companies/search?query=` - Search
- `GET /api/insurance-companies/paginate?page=&size=` - Paginated list

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/claims-per-day?startDate=&endDate=` - Claims analytics

## 🔐 Security & Authorization

### JWT Authentication
All endpoints (except `/api/auth/**`) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Permissions
The system uses fine-grained permissions:
- `users.view`, `users.manage`, `users.assign_roles`
- `roles.view`, `roles.manage`, `roles.assign_permissions`
- `permissions.view`, `permissions.manage`
- `insurance.view`, `insurance.manage`
- `reviewer.view`, `reviewer.manage`
- `employer.view`, `employer.manage`
- `member.view`, `member.manage`
- `claim.view`, `claim.manage`, `claim.approve`, `claim.reject`
- `visit.view`, `visit.manage`
- `dashboard.view`

### Default Roles
1. **ADMIN** - Full system access
2. **MANAGER** - Operations management (no user/role management)
3. **USER** - View-only access

## 📊 Database Schema

### Core Tables
- `users` - System users
- `roles` - User roles
- `permissions` - System permissions
- `user_roles` - User-Role mapping
- `role_permissions` - Role-Permission mapping

### Business Tables
- `insurance_companies`
- `reviewer_companies`
- `employers`
- `members`
- `claims`
- `visits`

## 🔧 Configuration

### Application Properties (`application.yml`)
```yaml
server:
  port: 9090

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

jwt:
  secret: ${JWT_SECRET:VGhpcy1pcy1hLUJhc2U2NC1leGFtcGxlLXNlY3JldC0uLi4=}
  expiration: 86400000  # 24 hours
```

## 📝 API Response Format

All API responses follow this structure:
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { },
  "timestamp": "2025-11-15T10:30:00"
}
```

## 🧪 Testing

### Swagger UI
Access interactive API documentation at:
**http://localhost:9090/swagger-ui.html**

### Sample Login Request
```bash
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "admin123"
  }'
```

### Sample Response
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "System Administrator",
      "email": "admin@tba-waad.com",
      "roles": ["ADMIN"],
      "permissions": ["users.view", "users.manage", ...]
    }
  },
  "timestamp": "2025-11-15T10:30:00"
}
```

## ✅ Implemented Features

### Phase B4 Completeness Checklist
- ✅ JWT Authentication & Authorization
- ✅ RBAC (Users, Roles, Permissions)
- ✅ Insurance Companies CRUD
- ✅ Reviewer Companies Entity & Repository
- ✅ Employers Entity & Repository
- ✅ Members Entity & Repository
- ✅ Claims Entity & Repository
- ✅ Visits Entity & Repository
- ✅ Dashboard Statistics
- ✅ Global Exception Handling
- ✅ CORS Configuration for React (http://localhost:3000)
- ✅ Data Seeding (Admin user + Permissions)
- ✅ Swagger Documentation
- ✅ Search & Pagination Support
- ✅ Audit Fields (createdAt, updatedAt)

## 🔄 Integration with Frontend

The backend is configured to work seamlessly with the React frontend:
- **Backend URL**: `http://localhost:9090`
- **Frontend URL**: `http://localhost:3000`
- **CORS**: Enabled for frontend origin
- **JWT**: Returned in login response, used in Authorization header

## 📚 Development Notes

### Adding New Modules
All modules follow the same pattern as `InsuranceCompany`:
1. Create Entity with JPA annotations
2. Create Repository extending JpaRepository
3. Create DTOs (CreateDto, UpdateDto, ResponseDto)
4. Create Mapper for DTO-Entity conversion
5. Create Service with business logic
6. Create Controller with REST endpoints

### Common Patterns
- Use `@PreAuthorize` for permission checks
- Return `ApiResponse<T>` from all controllers
- Log all operations with SLF4J
- Use `@Transactional` for database operations

## 🐛 Troubleshooting

### Lombok Not Working
If you see errors about missing getters/setters:
```bash
mvn clean compile -U
```

### Database Issues
For H2 console access: http://localhost:9090/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## 📞 Support & Documentation
- Swagger UI: http://localhost:9090/swagger-ui.html
- API Docs: http://localhost:9090/api-docs
- H2 Console: http://localhost:9090/h2-console

## 🎉 Success Criteria
✅ Backend compiles successfully  
✅ All core modules implemented  
✅ JWT authentication works  
✅ RBAC permissions enforced  
✅ Frontend can connect and authenticate  
✅ API responses match frontend expectations  
✅ Database schema created automatically  
✅ Admin user seeded with full permissions  

---
**TBA-WAAD Insurance System - Backend API v1.0.0**  
Built with ❤️ using Spring Boot 3.2 + Java 21
