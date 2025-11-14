# 🔐 TBA-WAAD RBAC System - Quick Start Guide

## 🎯 What's New
تم تطوير نظام RBAC (Role-Based Access Control) متكامل ليحل محل نظام الأدوار البسيط. النظام الجديد يوفر:

- **صلاحيات دقيقة**: تحكم مفصل في كل عملية
- **أدوار مرنة**: إمكانية تخصيص الأدوار حسب الحاجة  
- **JWT محسن**: يتضمن الصلاحيات والأدوار
- **API شاملة**: إدارة كاملة للأدوار والصلاحيات
- **أمان متقدم**: حماية على مستوى الطريقة والتحكم الدقيق

## 🚀 Quick Start

### 1. تشغيل النظام
```bash
cd /workspaces/tba-waad-system/backend
./mvnw spring-boot:run
```

### 2. الحسابات الافتراضية
```
Admin: admin / changeMeAdmin!
Review: reviewAdmin / changeMeReview!  
Insurance: insuranceAdmin / changeMeInsurance!
```

### 3. تسجيل الدخول والحصول على Token
```bash
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "changeMeAdmin!"
  }'
```

### 4. اختبار النظام الجديد
```bash
# عرض جميع الصلاحيات (Admin فقط)
curl -X GET http://localhost:9090/api/permissions \
  -H "Authorization: Bearer YOUR_TOKEN"

# عرض جميع الأدوار  
curl -X GET http://localhost:9090/api/roles \
  -H "Authorization: Bearer YOUR_TOKEN"

# عرض أدوار مستخدم معين
curl -X GET http://localhost:9090/api/user-roles/user/1/roles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 الأدوار والصلاحيات

### الأدوار المتاحة
| الدور | الوصف | الصلاحيات الرئيسية |
|-------|--------|-------------------|
| **ADMIN** | مدير النظام الكامل | جميع الصلاحيات |
| **REVIEW** | شركة المراجعة (وعد) | مراجعة وموافقة المطالبات |
| **INSURANCE** | شركة التأمين (الواحة) | إدارة الأعضاء والمطالبات |
| **EMPLOYER** | صاحب العمل | عرض الأعضاء والتقارير |
| **PROVIDER** | مزود الخدمة | إنشاء المطالبات |
| **MEMBER** | العضو المؤمن | عرض مطالباته الشخصية |

### الصلاحيات الرئيسية
```
إدارة المستخدمين: CREATE_USER, READ_USER, UPDATE_USER, DELETE_USER
إدارة الأعضاء: CREATE_MEMBER, READ_MEMBER, UPDATE_MEMBER, DELETE_MEMBER  
إدارة المطالبات: CREATE_CLAIM, READ_CLAIM, UPDATE_CLAIM, DELETE_CLAIM
موافقة المطالبات: APPROVE_CLAIM, REJECT_CLAIM
إدارة الأدوار: CREATE_ROLE, READ_ROLE, UPDATE_ROLE, DELETE_ROLE
إدارة الصلاحيات: CREATE_PERMISSION, READ_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSION
إدارة النظام: MANAGE_SYSTEM, VIEW_REPORTS, EXPORT_DATA
```

## 🛠️ إدارة النظام

### إنشاء صلاحية جديدة
```bash
curl -X POST http://localhost:9090/api/permissions \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MANAGE_CONTRACTS",
    "description": "إدارة العقود"
  }'
```

### إنشاء دور جديد
```bash
curl -X POST http://localhost:9090/api/roles \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CONTRACT_MANAGER", 
    "description": "مدير العقود"
  }'
```

### إضافة صلاحية إلى دور
```bash
curl -X POST http://localhost:9090/api/roles/{roleId}/permissions/{permissionId} \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### تعيين دور لمستخدم
```bash
curl -X POST http://localhost:9090/api/user-roles/assign?userId=1&roleId=2 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 🔍 مراقبة النظام

### عرض صلاحيات دور معين
```bash
curl -X GET http://localhost:9090/api/permissions/role/{roleId} \
  -H "Authorization: Bearer TOKEN"
```

### عرض أدوار مستخدم
```bash  
curl -X GET http://localhost:9090/api/user-roles/user/{userId}/roles \
  -H "Authorization: Bearer TOKEN"
```

### التحقق من وجود صلاحية
```bash
curl -X GET http://localhost:9090/api/permissions/name/{permissionName} \
  -H "Authorization: Bearer TOKEN"
```

## 💻 استخدام في الكود

### التحقق من الصلاحيات
```java
@PreAuthorize("hasAuthority('CREATE_CLAIM')")
public Claim createClaim(Claim claim) {
    // فقط المستخدمون الذين لديهم صلاحية CREATE_CLAIM
}

@PreAuthorize("hasRole('ADMIN') or hasAuthority('READ_USER')")
public List<User> getUsers() {
    // دور ADMIN أو صلاحية READ_USER
}
```

### الحصول على الصلاحيات من JWT
```java
// في Service أو Controller
String token = getTokenFromRequest(request);
List<String> permissions = jwtTokenProvider.extractPermissions(token);
List<String> roles = jwtTokenProvider.extractRoles(token);
Long userId = jwtTokenProvider.extractUserId(token);
```

### استخدام في User entity
```java
User user = getCurrentUser();

// التحقق من الدور
if (user.hasRole("ADMIN")) {
    // منطق خاص بالأدمن
}

// التحقق من الصلاحية  
if (user.hasPermission("CREATE_CLAIM")) {
    // السماح بإنشاء مطالبة
}

// الحصول على جميع الصلاحيات
Set<Permission> permissions = user.getAllPermissions();
```

## 🗄️ قاعدة البيانات

### الجداول الجديدة
```sql
permissions        -- الصلاحيات
roles             -- الأدوار 
role_permissions  -- ربط الأدوار بالصلاحيات
user_roles        -- ربط المستخدمين بالأدوار
```

### تشغيل schema يدوياً (اختياري)
```bash
psql -h localhost -U tba_user -d tba_waad_db -f database/rbac_schema.sql
```

## 🔧 استكشاف الأخطاء

### خطأ 403 Forbidden
```bash
# تحقق من أدوار المستخدم
curl -X GET http://localhost:9090/api/user-roles/user/{userId}/roles

# تحقق من صلاحيات الدور
curl -X GET http://localhost:9090/api/permissions/role/{roleId}
```

### خطأ في تسجيل الدخول
```bash
# تحقق من حالة المستخدم في قاعدة البيانات
SELECT u.username, u.active, ur.active as role_active, r.name as role 
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
LEFT JOIN roles r ON ur.role_id = r.id 
WHERE u.username = 'admin';
```

## 📚 الملفات المهمة

```
backend/
├── src/main/java/com/waad/tba/
│   ├── model/
│   │   ├── Permission.java          # كائن الصلاحية
│   │   ├── Role.java               # كائن الدور (محدث)
│   │   ├── UserRole.java           # ربط المستخدم بالدور
│   │   ├── RolePermission.java     # ربط الدور بالصلاحية
│   │   └── User.java               # محدث للنظام الجديد
│   ├── repository/
│   │   ├── PermissionRepository.java
│   │   ├── RoleRepository.java      
│   │   ├── UserRoleRepository.java
│   │   └── RolePermissionRepository.java
│   ├── service/
│   │   ├── PermissionService.java
│   │   ├── RoleService.java
│   │   └── UserRoleService.java
│   ├── controller/
│   │   ├── PermissionController.java
│   │   ├── RoleController.java
│   │   └── UserRoleController.java
│   ├── security/
│   │   ├── JwtTokenProvider.java    # محدث لإدراج الصلاحيات
│   │   └── JwtAuthenticationFilter.java # محدث للنظام الجديد
│   └── config/
│       └── DataInitializer.java     # محدث لإنشاء البيانات الأولية
├── database/
│   └── rbac_schema.sql              # مخطط قاعدة البيانات
└── RBAC_IMPLEMENTATION.md           # دليل تفصيلي
```

## 🎉 الخلاصة

النظام الجديد يوفر:
- ✅ تحكم دقيق في الصلاحيات
- ✅ مرونة في إدارة الأدوار  
- ✅ أمان متقدم مع JWT
- ✅ API شاملة للإدارة
- ✅ سهولة الصيانة والتطوير
- ✅ توافق مع Spring Security
- ✅ دعم Enterprise-level RBAC

للحصول على مساعدة تفصيلية، راجع ملف `RBAC_IMPLEMENTATION.md`.