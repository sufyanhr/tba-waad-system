# 🚀 SYSTEM ADMINISTRATION MODULE - Implementation Guide

## **Phase 2 - Backend API Design & Implementation**

### **📂 Project Structure**

```
backend/src/main/java/com/waad/tba/modules/systemadmin/
├── controller/
│   ├── UserManagementController.java
│   ├── RoleManagementController.java
│   ├── PermissionMatrixController.java
│   ├── FeatureFlagController.java
│   ├── ModuleAccessController.java
│   └── AuditLogController.java
├── service/
│   ├── UserManagementService.java
│   ├── RoleManagementService.java
│   ├── PermissionService.java
│   ├── FeatureFlagService.java
│   ├── ModuleAccessService.java
│   └── AuditLogService.java
├── repository/
│   ├── UserRepository.java (extends existing)
│   ├── RoleRepository.java (extends existing)
│   ├── PermissionRepository.java (extends existing)
│   ├── FeatureFlagRepository.java
│   └── ModuleAccessRepository.java
├── dto/
│   ├── UserCreateDto.java ✅
│   ├── UserUpdateDto.java
│   ├── UserViewDto.java
│   ├── RoleCreateDto.java
│   ├── RoleUpdateDto.java
│   ├── RoleViewDto.java
│   ├── PermissionMatrixDto.java
│   ├── FeatureFlagDto.java
│   └── ModuleAccessDto.java
└── entity/
    ├── FeatureFlag.java
    └── ModuleAccess.java
```

---

## **🔗 REST API Endpoints**

### **1. User Management** (`/api/admin/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users (paginated) | SUPER_ADMIN |
| GET | `/api/admin/users/{id}` | Get user by ID | SUPER_ADMIN |
| POST | `/api/admin/users` | Create new user | SUPER_ADMIN |
| PUT | `/api/admin/users/{id}` | Update user | SUPER_ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | SUPER_ADMIN |
| PUT | `/api/admin/users/{id}/toggle` | Activate/Deactivate user | SUPER_ADMIN |
| PUT | `/api/admin/users/{id}/reset-password` | Reset user password | SUPER_ADMIN |
| GET | `/api/admin/users/{id}/audit` | Get user audit log | SUPER_ADMIN |

**Request Example (Create User):**
```json
POST /api/admin/users
{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "+96512345678",
  "active": true,
  "roles": ["ADMIN", "EMPLOYER"],
  "permissions": ["MANAGE_MEMBERS", "VIEW_CLAIMS"],
  "employerId": 5
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phone": "+96512345678",
    "active": true,
    "roles": ["ADMIN", "EMPLOYER"],
    "permissions": ["MANAGE_MEMBERS", "VIEW_CLAIMS"],
    "employerId": 5,
    "createdAt": "2025-12-11T10:30:00Z",
    "createdBy": "superadmin"
  }
}
```

---

### **2. Role Management** (`/api/admin/roles`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/roles` | Get all roles | SUPER_ADMIN |
| GET | `/api/admin/roles/{id}` | Get role by ID | SUPER_ADMIN |
| POST | `/api/admin/roles` | Create new role | SUPER_ADMIN |
| PUT | `/api/admin/roles/{id}` | Update role | SUPER_ADMIN |
| DELETE | `/api/admin/roles/{id}` | Delete role | SUPER_ADMIN |
| GET | `/api/admin/roles/{id}/users` | Get users with this role | SUPER_ADMIN |
| PUT | `/api/admin/roles/{id}/permissions` | Assign permissions to role | SUPER_ADMIN |

**Request Example (Create Role):**
```json
POST /api/admin/roles
{
  "name": "REGIONAL_MANAGER",
  "description": "Regional office manager with limited access",
  "permissions": ["VIEW_MEMBERS", "VIEW_CLAIMS", "MANAGE_EMPLOYERS"],
  "active": true
}
```

---

### **3. Permission Matrix** (`/api/admin/permissions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/permissions` | Get all permissions | SUPER_ADMIN |
| GET | `/api/admin/permissions/matrix` | Get permission matrix (roles × permissions) | SUPER_ADMIN |
| POST | `/api/admin/permissions/assign` | Assign permission to role/user | SUPER_ADMIN |
| POST | `/api/admin/permissions/remove` | Remove permission from role/user | SUPER_ADMIN |
| GET | `/api/admin/permissions/role/{roleId}` | Get permissions for specific role | SUPER_ADMIN |
| GET | `/api/admin/permissions/user/{userId}` | Get effective permissions for user | SUPER_ADMIN |

**Response Example (Permission Matrix):**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "roleId": 1,
        "roleName": "ADMIN",
        "permissions": ["MANAGE_MEMBERS", "MANAGE_EMPLOYERS", "MANAGE_CLAIMS", "VIEW_REPORTS"]
      },
      {
        "roleId": 2,
        "roleName": "EMPLOYER",
        "permissions": ["VIEW_MEMBERS", "MANAGE_MEMBERS", "VIEW_CLAIMS"]
      },
      {
        "roleId": 3,
        "roleName": "INSURANCE_COMPANY",
        "permissions": ["VIEW_EMPLOYERS", "MANAGE_POLICIES", "VIEW_CLAIMS"]
      }
    ],
    "allPermissions": [
      "MANAGE_MEMBERS",
      "VIEW_MEMBERS",
      "MANAGE_EMPLOYERS",
      "VIEW_EMPLOYERS",
      "MANAGE_CLAIMS",
      "VIEW_CLAIMS",
      "MANAGE_POLICIES",
      "VIEW_REPORTS"
    ]
  }
}
```

---

### **4. Feature Flags** (`/api/admin/features`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/features` | Get all feature flags | SUPER_ADMIN |
| GET | `/api/admin/features/{key}` | Get specific feature flag | SUPER_ADMIN |
| PUT | `/api/admin/features/{key}/toggle` | Enable/Disable feature | SUPER_ADMIN |
| POST | `/api/admin/features` | Create new feature flag | SUPER_ADMIN |
| DELETE | `/api/admin/features/{key}` | Delete feature flag | SUPER_ADMIN |

**Feature Flag Keys:**
- `MEMBERS_MODULE_ENABLED`
- `CLAIMS_MODULE_ENABLED`
- `PREAPPROVALS_MODULE_ENABLED`
- `PROVIDERS_MODULE_ENABLED`
- `EMPLOYERS_MODULE_ENABLED`
- `INSURANCE_COMPANIES_MODULE_ENABLED`
- `REVIEWERS_MODULE_ENABLED`
- `CHRONIC_CARE_MODULE_ENABLED`
- `MEDICAL_SERVICES_MODULE_ENABLED`
- `MEDICAL_PACKAGES_MODULE_ENABLED`
- `REPORTS_MODULE_ENABLED`
- `DASHBOARD_MODULE_ENABLED`

**Request Example (Toggle Feature):**
```json
PUT /api/admin/features/CLAIMS_MODULE_ENABLED/toggle
{
  "enabled": false,
  "roleFilters": ["EMPLOYER", "ADMIN"],
  "reason": "Temporarily disable claims for employers during system maintenance"
}
```

---

### **5. Module Access Control** (`/api/admin/modules`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/modules` | Get all modules | SUPER_ADMIN |
| GET | `/api/admin/modules/{id}` | Get module by ID | SUPER_ADMIN |
| PUT | `/api/admin/modules/{id}/access` | Update module access | SUPER_ADMIN |
| GET | `/api/admin/modules/role/{roleId}` | Get accessible modules for role | SUPER_ADMIN |

**Modules:**
1. Members Management
2. Claims Processing
3. Pre-Approvals
4. Providers Network
5. Employers Management
6. Insurance Companies
7. Reviewer Management
8. Chronic Care Management
9. Medical Services
10. Medical Packages
11. Reports & Analytics
12. Dashboard

**Request Example (Update Module Access):**
```json
PUT /api/admin/modules/1/access
{
  "moduleId": 1,
  "moduleName": "Members Management",
  "allowedRoles": ["SUPER_ADMIN", "ADMIN", "EMPLOYER"],
  "requiredPermissions": ["VIEW_MEMBERS"],
  "featureFlagKey": "MEMBERS_MODULE_ENABLED",
  "active": true
}
```

---

### **6. Audit Log** (`/api/admin/audit`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/audit` | Get all audit logs (paginated) | SUPER_ADMIN |
| GET | `/api/admin/audit/user/{userId}` | Get audit logs for specific user | SUPER_ADMIN |
| GET | `/api/admin/audit/entity/{entityType}/{entityId}` | Get audit logs for entity | SUPER_ADMIN |
| GET | `/api/admin/audit/actions` | Get all action types | SUPER_ADMIN |

**Response Example:**
```json
{
  "success": true,
  "data": {
    "totalItems": 1523,
    "currentPage": 1,
    "pageSize": 50,
    "items": [
      {
        "id": 45123,
        "timestamp": "2025-12-11T14:23:15Z",
        "userId": 5,
        "username": "admin_user",
        "action": "USER_CREATED",
        "entityType": "User",
        "entityId": 123,
        "details": "Created user: john.doe with roles: ADMIN, EMPLOYER",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0..."
      }
    ]
  }
}
```

---

## **🗄️ Database Schema**

### **New Tables:**

```sql
-- Feature Flags Table
CREATE TABLE feature_flags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flag_key VARCHAR(100) UNIQUE NOT NULL,
    flag_name VARCHAR(255) NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    role_filters JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

-- Module Access Table
CREATE TABLE module_access (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_name VARCHAR(100) NOT NULL,
    module_key VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    allowed_roles JSON NOT NULL,
    required_permissions JSON,
    feature_flag_key VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (feature_flag_key) REFERENCES feature_flags(flag_key)
);

-- Enhanced Audit Log Table
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    username VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_timestamp (timestamp),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## **🔒 Security Annotations**

All controllers must use:

```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "*")
public class UserManagementController {
    // All methods restricted to SUPER_ADMIN only
}
```

---

## **✅ Implementation Checklist**

### **Backend (Phase 2):**
- [ ] Create all DTOs (UserCreateDto, UserUpdateDto, etc.)
- [ ] Create Entity classes (FeatureFlag, ModuleAccess)
- [ ] Create Repositories (FeatureFlagRepository, ModuleAccessRepository)
- [ ] Create Services (UserManagementService, RoleManagementService, etc.)
- [ ] Create Controllers (All 6 controllers)
- [ ] Add database migration scripts
- [ ] Add Spring Security rules for `/api/admin/**`
- [ ] Add Swagger/OpenAPI documentation
- [ ] Write unit tests
- [ ] Write integration tests

### **Frontend (Phase 3):**
- [ ] Create UserManagement.jsx page
- [ ] Create RoleManagement.jsx page
- [ ] Create PermissionMatrix.jsx page
- [ ] Create FeatureFlags.jsx page
- [ ] Create ModuleAccess.jsx page
- [ ] Create AuditLog.jsx page
- [ ] Create API service files (systemAdmin.service.js)
- [ ] Create custom hooks (useUsers, useRoles, usePermissions)
- [ ] Add routing in MainRoutes.jsx
- [ ] Add form validations

### **Integration (Phase 4):**
- [ ] Update RouteGuard to check feature flags
- [ ] Update RBAC store to handle feature flags
- [ ] Update Sidebar to hide disabled modules
- [ ] Add real-time feature flag sync
- [ ] Add permission checking middleware

### **Testing (Phase 5):**
- [ ] SUPER_ADMIN login → full access test
- [ ] Create test user → assign roles → login test
- [ ] Feature flag toggle test
- [ ] Module access control test
- [ ] Permission matrix validation test
- [ ] Audit log verification test

---

## **🚀 Next Steps**

1. **Complete Backend Implementation** (Phase 2)
2. **Build Frontend Pages** (Phase 3)
3. **Integrate RBAC with Feature Flags** (Phase 4)
4. **End-to-End Testing** (Phase 5)

---

**Status:** Phase 1 ✅ Complete | Phase 2 🚧 In Progress | Phase 3-5 ⏳ Pending
