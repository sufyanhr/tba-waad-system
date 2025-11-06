# TBA-WAAD Backend API

Third Party Administrator - Health Insurance Platform Backend API built with Spring Boot 3.x and Java 21.

## Features

- ✅ Spring Boot 3.2.5 with Java 21
- ✅ PostgreSQL Database Integration
- ✅ JWT Authentication & Authorization
- ✅ Role-Based Access Control (ADMIN, INSURANCE, PROVIDER, EMPLOYER, MEMBER)
- ✅ RESTful API Design
- ✅ Swagger/OpenAPI Documentation
- ✅ Global Exception Handling
- ✅ CORS Configuration
- ✅ JPA/Hibernate with Auditing
- ✅ Bean Validation

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+

## Database Setup

1. Install PostgreSQL if not already installed

2. Create the database:
```sql
CREATE DATABASE tba_waad;
```

3. The application will automatically create tables on startup (using `spring.jpa.hibernate.ddl-auto=update`)

## Configuration

Edit `src/main/resources/application.yml` to configure:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tba_waad
    username: postgres
    password: 12345
```

### JWT Configuration

The JWT secret can be configured via environment variable or application.yml:
```yaml
jwt:
  secret: ${JWT_SECRET:your-secret-key-here}
  expiration: 86400000  # 24 hours in milliseconds
```

## Build and Run

### Using Maven

1. Clean and build:
```bash
mvn clean install
```

2. Run the application:
```bash
mvn spring-boot:run
```

3. The application will start on `http://localhost:8080`

### Using Java

1. Build the JAR:
```bash
mvn clean package
```

2. Run the JAR:
```bash
java -jar target/tba-backend-1.0.0.jar
```

## API Documentation

Once the application is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

API docs JSON available at:
```
http://localhost:8080/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users (ADMIN, INSURANCE)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (ADMIN only)

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/{id}` - Get organization by ID
- `POST /api/organizations` - Create organization (ADMIN, INSURANCE)
- `PUT /api/organizations/{id}` - Update organization
- `DELETE /api/organizations/{id}` - Delete organization (ADMIN only)

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `GET /api/members/organization/{organizationId}` - Get members by organization
- `POST /api/members` - Create member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

### Providers
- `GET /api/providers` - Get all providers
- `GET /api/providers/{id}` - Get provider by ID
- `POST /api/providers` - Create provider
- `PUT /api/providers/{id}` - Update provider
- `DELETE /api/providers/{id}` - Delete provider

### Claims
- `GET /api/claims` - Get all claims
- `GET /api/claims/{id}` - Get claim by ID
- `GET /api/claims/member/{memberId}` - Get claims by member
- `GET /api/claims/provider/{providerId}` - Get claims by provider
- `GET /api/claims/status/{status}` - Get claims by status
- `POST /api/claims` - Create claim
- `PUT /api/claims/{id}` - Update claim
- `PATCH /api/claims/{id}/approve` - Approve claim
- `PATCH /api/claims/{id}/reject` - Reject claim
- `DELETE /api/claims/{id}` - Delete claim

### Approvals (Pre-Authorization)
- `GET /api/approvals` - Get all approvals
- `GET /api/approvals/{id}` - Get approval by ID
- `GET /api/approvals/member/{memberId}` - Get approvals by member
- `GET /api/approvals/provider/{providerId}` - Get approvals by provider
- `GET /api/approvals/status/{status}` - Get approvals by status
- `POST /api/approvals` - Create approval request
- `PUT /api/approvals/{id}` - Update approval
- `PATCH /api/approvals/{id}/approve` - Approve request
- `PATCH /api/approvals/{id}/reject` - Reject request
- `DELETE /api/approvals/{id}` - Delete approval

### Finance
- `GET /api/finance` - Get all finance records
- `GET /api/finance/{id}` - Get finance record by ID
- `GET /api/finance/provider/{providerId}` - Get finance records by provider
- `GET /api/finance/status/{status}` - Get finance records by status
- `POST /api/finance` - Create finance record
- `PUT /api/finance/{id}` - Update finance record
- `PATCH /api/finance/{id}/pay` - Mark as paid
- `DELETE /api/finance/{id}` - Delete finance record

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/claims-summary` - Get claims summary report
- `GET /api/reports/financial-summary` - Get financial summary report
- `GET /api/reports/provider-performance` - Get provider performance report
- `GET /api/reports/member-utilization` - Get member utilization report

## Authentication

All endpoints except `/api/auth/**` require JWT authentication.

1. Login to get JWT token:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

2. Use the token in subsequent requests:
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## User Roles

- **ADMIN**: Full system access
- **INSURANCE**: Insurance company staff - manage claims, approvals, members
- **PROVIDER**: Healthcare provider - submit claims, view approvals
- **EMPLOYER**: Organization/employer - view members and reports
- **MEMBER**: Insured member - view own claims and approvals

## Default Users

To create the first admin user, use the registration endpoint:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@tba-waad.com",
    "password": "admin123",
    "fullName": "System Administrator",
    "roles": ["ADMIN"]
  }'
```

## Project Structure

```
backend/
├── src/main/java/com/waad/tba/
│   ├── TbaWaadApplication.java       # Main application class
│   ├── config/                        # Configuration classes
│   │   ├── CorsConfig.java
│   │   ├── OpenAPIConfig.java
│   │   └── SecurityConfig.java
│   ├── controller/                    # REST controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── OrganizationController.java
│   │   ├── MemberController.java
│   │   ├── ProviderController.java
│   │   ├── ClaimController.java
│   │   ├── ApprovalController.java
│   │   ├── FinanceController.java
│   │   └── ReportController.java
│   ├── dto/                           # Data Transfer Objects
│   │   ├── ApiResponse.java
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── RegisterRequest.java
│   ├── exception/                     # Exception handling
│   │   ├── BadRequestException.java
│   │   ├── GlobalExceptionHandler.java
│   │   └── ResourceNotFoundException.java
│   ├── model/                         # JPA entities
│   │   ├── User.java
│   │   ├── Organization.java
│   │   ├── Member.java
│   │   ├── Provider.java
│   │   ├── Claim.java
│   │   ├── Approval.java
│   │   ├── Finance.java
│   │   └── AuditLog.java
│   ├── repository/                    # JPA repositories
│   │   ├── UserRepository.java
│   │   ├── OrganizationRepository.java
│   │   ├── MemberRepository.java
│   │   ├── ProviderRepository.java
│   │   ├── ClaimRepository.java
│   │   ├── ApprovalRepository.java
│   │   ├── FinanceRepository.java
│   │   └── AuditLogRepository.java
│   ├── security/                      # Security & JWT
│   │   ├── CustomUserDetailsService.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── JwtTokenProvider.java
│   └── service/                       # Business logic
│       ├── AuthService.java
│       ├── UserService.java
│       ├── OrganizationService.java
│       ├── MemberService.java
│       ├── ProviderService.java
│       ├── ClaimService.java
│       ├── ApprovalService.java
│       └── FinanceService.java
└── src/main/resources/
    └── application.yml                # Application configuration
```

## Development

### Running Tests
```bash
mvn test
```

### Code Formatting
The project uses standard Java formatting conventions.

### Debugging
Run with debug enabled:
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## CORS Configuration

The application is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend)

To add more origins, edit `CorsConfig.java`.

## Production Deployment

1. Update `application.yml` with production database credentials
2. Set a strong JWT secret via environment variable:
   ```bash
   export JWT_SECRET=your-production-secret-key
   ```
3. Build production JAR:
   ```bash
   mvn clean package -DskipTests
   ```
4. Run with production profile:
   ```bash
   java -jar target/tba-backend-1.0.0.jar --spring.profiles.active=prod
   ```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `sudo service postgresql status`
- Check database exists: `psql -U postgres -l`
- Verify credentials in `application.yml`

### Port Already in Use
Change the port in `application.yml`:
```yaml
server:
  port: 8081
```

### JWT Token Issues
- Verify the token is being sent in the `Authorization` header as `Bearer <token>`
- Check token expiration (default 24 hours)

## License

Copyright © 2024 TBA-WAAD. All rights reserved.
