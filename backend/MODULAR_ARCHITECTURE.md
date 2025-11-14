# 🏗️ TBA-WAAD Enterprise Modular Architecture 

## 📁 New Project Structure

```
backend/src/main/java/com/waad/tba/
├── TbaWaadApplication.java           # Main Spring Boot application
│
├── 🔧 core/                          # Core infrastructure layer
│   ├── base/                         # Base classes for all entities/services/controllers
│   │   ├── BaseEntity.java           # Common entity fields & methods
│   │   ├── BaseRepository.java       # Common repository operations  
│   │   ├── BaseService.java          # Common service operations
│   │   └── BaseController.java       # Common REST endpoints
│   ├── config/                       # Application configuration
│   │   ├── DataInitializer.java      # Database initialization
│   │   ├── OpenApiConfig.java        # Swagger/OpenAPI setup
│   │   └── SecurityConfig.java       # Spring Security configuration
│   ├── dto/                         # Core DTOs
│   │   └── ApiResponse.java          # Standard API response wrapper
│   ├── exception/                    # Global exception handling
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── BadRequestException.java
│   │   ├── ValidationException.java
│   │   └── DomainException.java
│   └── util/                        # Utility classes
│       ├── ClaimNumberGenerator.java
│       └── MemberNumberGenerator.java
│
├── 🔐 security/                      # Authentication & authorization
│   ├── User.java                     # User entity
│   ├── UserRepository.java          # User repository
│   ├── UserService.java             # User business logic
│   ├── AuthService.java             # Authentication service
│   ├── AuthController.java          # Auth endpoints (/api/auth/*)
│   ├── UserController.java          # User management endpoints
│   ├── JwtTokenProvider.java        # JWT token operations
│   ├── JwtAuthenticationFilter.java # JWT request filter
│   ├── CustomUserDetailsService.java# Spring Security UserDetails
│   └── dto/                         # Auth DTOs
│       ├── LoginRequest.java
│       ├── LoginResponse.java
│       └── RegisterRequest.java
│
├── 🎭 rbac/                          # Role-Based Access Control
│   ├── model/                       # RBAC entities
│   │   ├── Permission.java
│   │   ├── Role.java
│   │   ├── UserRole.java
│   │   └── RolePermission.java
│   ├── repository/                  # RBAC repositories
│   │   ├── PermissionRepository.java
│   │   ├── RoleRepository.java
│   │   ├── UserRoleRepository.java
│   │   └── RolePermissionRepository.java
│   ├── service/                     # RBAC business logic
│   │   ├── PermissionService.java
│   │   ├── RoleService.java
│   │   └── UserRoleService.java
│   └── controller/                  # RBAC endpoints
│       ├── PermissionController.java # /api/permissions
│       ├── RoleController.java      # /api/roles
│       └── UserRoleController.java  # /api/user-roles
│
└── 🧩 modules/                       # Business domain modules
    │
    ├── 👥 members/                   # Member management
    │   ├── model/
    │   │   ├── Member.java
    │   │   └── BenefitTable.java
    │   ├── dto/
    │   │   └── BenefitTableDTO.java
    │   ├── repository/
    │   │   ├── MemberRepository.java
    │   │   └── BenefitTableRepository.java
    │   ├── service/
    │   │   ├── MemberService.java
    │   │   └── BenefitTableService.java
    │   └── controller/
    │       ├── MemberController.java
    │       ├── BenefitTableController.java
    │       └── MemberVerificationController.java
    │
    ├── 📋 claims/                    # Claims processing
    │   ├── model/
    │   │   ├── Claim.java
    │   │   ├── ClaimAttachment.java
    │   │   └── Approval.java
    │   ├── repository/
    │   │   ├── ClaimRepository.java
    │   │   ├── ClaimAttachmentRepository.java
    │   │   └── ApprovalRepository.java
    │   ├── service/
    │   │   ├── ClaimService.java
    │   │   ├── ClaimAttachmentService.java
    │   │   └── ApprovalService.java
    │   └── controller/
    │       ├── ClaimController.java
    │       ├── ClaimAttachmentController.java
    │       └── ApprovalController.java
    │
    ├── 🏥 providers/                 # Healthcare providers
    │   ├── model/
    │   │   └── Provider.java
    │   ├── repository/
    │   │   └── ProviderRepository.java
    │   ├── service/
    │   │   └── ProviderService.java
    │   └── controller/
    │       └── ProviderController.java
    │
    ├── 🛡️ insurance/                 # Insurance companies
    │   ├── model/
    │   │   ├── InsuranceCompany.java
    │   │   ├── ReviewCompany.java
    │   │   └── Policy.java
    │   ├── dto/
    │   │   ├── PolicyDTO.java
    │   │   └── InsuranceCompanyDTO.java
    │   ├── repository/
    │   │   ├── InsuranceCompanyRepository.java
    │   │   ├── ReviewCompanyRepository.java
    │   │   └── PolicyRepository.java
    │   ├── service/
    │   │   ├── InsuranceCompanyService.java
    │   │   ├── ReviewCompanyService.java
    │   │   └── PolicyService.java
    │   └── controller/
    │       ├── InsuranceCompanyController.java
    │       ├── ReviewCompanyController.java
    │       └── PolicyController.java
    │
    ├── 🏢 employers/                 # Employer organizations
    │   ├── model/
    │   │   └── Organization.java
    │   ├── repository/
    │   │   └── OrganizationRepository.java
    │   ├── service/
    │   │   └── OrganizationService.java
    │   └── controller/
    │       └── OrganizationController.java
    │
    ├── 💰 finance/                   # Financial operations
    │   ├── model/
    │   │   └── Finance.java
    │   ├── repository/
    │   │   └── FinanceRepository.java
    │   ├── service/
    │   │   └── FinanceService.java
    │   └── controller/
    │       └── FinanceController.java
    │
    ├── 📊 reports/                   # Reporting & analytics
    │   ├── model/
    │   │   └── AuditLog.java
    │   ├── repository/
    │   │   └── AuditLogRepository.java
    │   ├── service/
    │   │   └── AuditLogService.java
    │   └── controller/
    │       ├── ReportController.java
    │       ├── DashboardController.java
    │       └── AuditLogController.java
    │
    └── ⚙️ settings/                  # System configuration
        ├── model/
        │   └── SystemSetting.java
        ├── repository/
        │   └── SystemSettingRepository.java
        ├── service/
        │   └── SystemSettingService.java
        └── controller/
            └── SystemSettingController.java
```

## 🎯 Architecture Benefits

### 🧩 **Modular Design**
- **Clear separation of concerns** - each module handles one domain
- **Independent development** - teams can work on different modules
- **Easy to test** - isolated business logic per module
- **Scalable** - add new modules without affecting existing ones

### 🔧 **Core Layer**
- **BaseEntity** - common fields (id, createdAt, updatedAt, active)
- **BaseRepository** - standard CRUD with soft delete support
- **BaseService** - common business operations
- **BaseController** - standard REST endpoints with security
- **Global exception handling** - consistent error responses

### 🔐 **Security Module**
- **JWT-based authentication** with enhanced token payload
- **RBAC integration** - roles and permissions in JWT
- **User management** - registration, login, profile management

### 🎭 **RBAC Module** 
- **Granular permissions** - fine-grained access control
- **Flexible roles** - easily configurable role-permission mapping
- **Enterprise-ready** - supports complex permission hierarchies

### 🚀 **Business Modules**
- **Domain-driven design** - each module represents a business domain
- **Consistent structure** - model/dto/repository/service/controller
- **Clear dependencies** - modules depend on core, not each other

## 📋 **Migration Summary**

✅ **Completed Tasks:**
1. ✅ Created modular folder structure
2. ✅ Moved all existing classes to appropriate modules
3. ✅ Created base classes for common functionality
4. ✅ Updated all package imports
5. ✅ Updated component scanning configuration
6. ✅ Moved security classes to dedicated module
7. ✅ Organized RBAC system in dedicated module
8. ✅ Split business domains into separate modules
9. ✅ Updated configuration and exception handling

## 🛠️ **Usage Examples**

### Creating a new module:
```bash
mkdir -p src/main/java/com/waad/tba/modules/newmodule/{model,dto,repository,service,controller}
```

### Extending BaseEntity:
```java
@Entity
public class MyEntity extends BaseEntity {
    // Your specific fields
}
```

### Using BaseService:
```java
@Service
public class MyService extends BaseService<MyEntity, MyRepository> {
    public MyService(MyRepository repository) {
        super(repository);
    }
    
    @Override
    protected String getEntityName() {
        return "MyEntity";
    }
}
```

### Creating controllers:
```java
@RestController
@RequestMapping("/api/myentities")
public class MyController extends BaseController<MyEntity, MyService> {
    public MyController(MyService service) {
        super(service);
    }
    
    @Override
    protected String getEntityName() {
        return "MyEntity";
    }
}
```

## 🔗 **Dependencies**

The module dependency hierarchy:
```
Modules → Core ← Security ← RBAC
```

- **Modules** can depend on Core
- **Security** depends on Core  
- **RBAC** depends on Core and Security
- **Modules** should not depend on each other directly

This ensures loose coupling and maintainability.

## 🎉 **Result**

The backend now follows **Enterprise Modular Architecture** with:
- ✅ **Clean separation** of concerns
- ✅ **Scalable** and maintainable structure  
- ✅ **Reusable** base components
- ✅ **Consistent** patterns across modules
- ✅ **Enterprise-ready** RBAC system
- ✅ **Security-first** design
- ✅ **Domain-driven** organization