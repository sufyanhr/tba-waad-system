# 🛡️ نظام إدارة الأدوار والصلاحيات (RBAC)
## TBA-WAAD Insurance Management System

---

## 📋 نظرة عامة

تم تطوير نظام RBAC متكامل لإدارة نظام التأمين TBA-WAAD يوفر:
- مصادقة JWT آمنة
- إدارة شاملة للأدوار والصلاحيات
- واجهة إدارية متكاملة
- حماية على مستوى المكونات والمسارات

---

## 🚀 الميزات الرئيسية

### ✅ المصادقة والتخويل (Authentication & Authorization)
- **JWT Token Management**: إدارة متقدمة للرموز المميزة
- **Role-Based Access Control**: تحكم بالوصول بناءً على الأدوار
- **Permission Guards**: حماية المكونات والصفحات
- **Dynamic Menu Filtering**: تصفية القوائم بناءً على الصلاحيات

### ✅ لوحة إدارة RBAC
- **إدارة الأدوار**: إنشاء، تعديل، حذف الأدوار
- **إدارة الصلاحيات**: إنشاء، تعديل، حذف الصلاحيات
- **تعيين الأدوار**: ربط المستخدمين بالأدوار
- **تعيين الصلاحيات**: ربط الأدوار بالصلاحيات

### ✅ واجهة مستخدم محسنة
- **Material-UI Components**: تصميم عصري ومتجاوب
- **Loading States**: حالات تحميل محسنة
- **Error Handling**: معالجة شاملة للأخطاء
- **Notifications**: نظام إشعارات متقدم

---

## 🏗️ الهيكل التقني

### المجلدات الرئيسية:
```
frontend/src/
├── api/
│   └── rbac.js                    # RBAC API service layer
├── components/
│   ├── auth/
│   │   ├── PermissionGuard.jsx    # حماية المكونات
│   │   └── ProtectedRoute.jsx     # حماية المسارات
│   ├── rbac/
│   │   ├── RbacLoaders.jsx        # مكونات التحميل
│   │   └── RbacNotifications.jsx  # نظام الإشعارات
│   └── @extended/
│       └── RoleBadge.jsx          # شارة الأدوار
├── contexts/
│   └── JWTContext.jsx             # إدارة حالة المصادقة
├── pages/rbac/
│   ├── roles/                     # صفحات إدارة الأدوار
│   ├── permissions/               # صفحات إدارة الصلاحيات
│   └── users/                     # صفحات تعيين المستخدمين
├── menu-items/
│   └── rbac.js                    # قائمة RBAC
└── utils/
    └── permissions.js             # ثوابت الصلاحيات والأدوار
```

### Backend Integration:
```
backend/src/main/java/com/waad/tba/
├── modules/auth/                  # JWT Authentication
├── modules/rbac/                  # RBAC Management
├── security/                      # Security Configuration
└── config/                        # Application Configuration
```

---

## 🔧 الاستخدام

### 1. تشغيل النظام:

#### Frontend:
```bash
cd /workspaces/tba-waad-system/frontend
npm start
```
الواجهة الأمامية: http://localhost:3004

#### Backend:
```bash
cd /workspaces/tba-waad-system/backend
mvn spring-boot:run
```
الخلفية: http://localhost:9090

### 2. الوصول لـ RBAC Admin Panel:
- انتقل إلى: `/admin/rbac`
- يتطلب صلاحية: `roles.manage` أو `admin.panel`

### 3. استخدام Permission Guards:
```jsx
import PermissionGuard from 'components/auth/PermissionGuard';
import { PERMISSIONS } from 'utils/permissions';

<PermissionGuard permissions={[PERMISSIONS.USERS_EDIT]}>
  <Button>تعديل المستخدم</Button>
</PermissionGuard>
```

### 4. حماية المسارات:
```jsx
import ProtectedRoute from 'components/ProtectedRoute';
import { PERMISSIONS } from 'utils/permissions';

<ProtectedRoute permissions={[PERMISSIONS.ADMIN_PANEL]}>
  <AdminPanel />
</ProtectedRoute>
```

---

## 🎯 دليل الصلاحيات

### صلاحيات المستخدمين:
- `users.view` - عرض المستخدمين
- `users.create` - إنشاء مستخدم جديد
- `users.edit` - تعديل المستخدمين
- `users.delete` - حذف المستخدمين
- `users.assign_roles` - تعيين الأدوار

### صلاحيات الأدوار:
- `roles.view` - عرض الأدوار
- `roles.create` - إنشاء دور جديد
- `roles.edit` - تعديل الأدوار
- `roles.delete` - حذف الأدوار
- `roles.manage` - إدارة شاملة للأدوار
- `roles.assign_permissions` - تعيين الصلاحيات

### صلاحيات الصلاحيات:
- `permissions.view` - عرض الصلاحيات
- `permissions.create` - إنشاء صلاحية جديدة
- `permissions.edit` - تعديل الصلاحيات
- `permissions.delete` - حذف الصلاحيات
- `permissions.manage` - إدارة شاملة للصلاحيات

### صلاحيات العملاء:
- `customers.view` - عرض العملاء
- `customers.create` - إنشاء عميل جديد
- `customers.edit` - تعديل العملاء
- `customers.delete` - حذف العملاء

---

## 🔒 الأدوار الافتراضية

### ADMIN (مدير نظام):
- جميع الصلاحيات
- وصول كامل لجميع الوظائف

### MANAGER (مدير):
- إدارة العملاء والتقارير
- صلاحيات محدودة لإدارة المستخدمين

### EMPLOYEE (موظف):
- عرض وتعديل العملاء
- عرض التقارير الأساسية

### USER (مستخدم):
- صلاحيات القراءة فقط
- عرض البيانات الأساسية

---

## 🛠️ التحسينات المطبقة

### ✅ مكونات محسنة:
- **Permission Constants**: ثوابت مركزية للصلاحيات
- **Role Badge**: شارة ملونة للأدوار  
- **Error Boundary**: معالجة أخطاء React
- **Advanced Loaders**: مكونات تحميل محسنة
- **Notification System**: نظام إشعارات متقدم

### ✅ تحسينات الأداء:
- **Lazy Loading**: تحميل المكونات عند الطلب
- **Code Splitting**: تقسيم الكود للتحسين
- **Memoization**: تحسين إعادة الرندر
- **Efficient State Management**: إدارة حالة محسنة

### ✅ أمان محسن:
- **JWT Validation**: تحقق من صحة الرموز
- **Permission Checking**: فحص الصلاحيات في الوقت الفعلي
- **Route Protection**: حماية شاملة للمسارات
- **Component Guards**: حماية على مستوى المكونات

---

## 📱 واجهة المستخدم

### قوائم RBAC في الشريط الجانبي:
```
🛡️ RBAC Administration
├── 👥 Roles Management
│   ├── 📋 List Roles
│   ├── ➕ Create Role
│   └── 🔗 Assign Permissions
├── 🔑 Permissions Management
│   ├── 📋 List Permissions
│   ├── ➕ Create Permission
│   └── ✏️ Edit Permission
└── 👤 User Management
    ├── 🔗 Assign Roles
    └── 📋 Manage Users
```

### الصفحات الرئيسية:
- `/admin/rbac/roles` - قائمة الأدوار
- `/admin/rbac/roles/create` - إنشاء دور
- `/admin/rbac/roles/edit/:id` - تعديل دور
- `/admin/rbac/permissions` - قائمة الصلاحيات
- `/admin/rbac/permissions/create` - إنشاء صلاحية
- `/admin/rbac/assign-roles` - تعيين أدوار
- `/admin/rbac/assign-permissions` - تعيين صلاحيات

---

## 🔧 API Endpoints

### Roles API:
```
GET    /api/admin/roles           # قائمة الأدوار
GET    /api/admin/roles/{id}      # دور محدد
POST   /api/admin/roles           # إنشاء دور
PUT    /api/admin/roles/{id}      # تحديث دور
DELETE /api/admin/roles/{id}      # حذف دور
```

### Permissions API:
```
GET    /api/admin/permissions         # قائمة الصلاحيات
GET    /api/admin/permissions/{id}    # صلاحية محددة
POST   /api/admin/permissions         # إنشاء صلاحية
PUT    /api/admin/permissions/{id}    # تحديث صلاحية
DELETE /api/admin/permissions/{id}    # حذف صلاحية
```

### Assignments API:
```
POST   /api/admin/users/{userId}/roles                # تعيين أدوار للمستخدم
POST   /api/admin/roles/{roleId}/permissions          # تعيين صلاحيات للدور
GET    /api/admin/users                               # قائمة المستخدمين
```

---

## ✨ نصائح الاستخدام

### للمطورين:
1. **استخدم Permission Constants**: دائماً استخدم `PERMISSIONS` من `utils/permissions.js`
2. **طبق PermissionGuard**: احم جميع المكونات الحساسة
3. **اختبر الصلاحيات**: تأكد من اختبار جميع مستويات الوصول
4. **استخدم TypeScript**: لتحسين الأمان ومنع الأخطاء

### للمديرين:
1. **أنشئ أدوار محددة**: لا تعطي صلاحيات أكثر من اللازم
2. **راجع الصلاحيات دورياً**: تأكد من صحة التخصيصات
3. **استخدم مبدأ أقل صلاحية**: ابدأ بأقل الصلاحيات المطلوبة
4. **وثق التغييرات**: احتفظ بسجل للتعديلات

---

## 🎯 المراحل المكتملة

- ✅ **A2-A5**: Backend Development & Security
- ✅ **B1**: Frontend Authentication Integration  
- ✅ **B2**: Role & Permission System Implementation
- ✅ **B3**: RBAC Management Panel Implementation

## 📞 الدعم

للمساعدة أو الاستفسارات:
- مطور النظام: GitHub Copilot
- التوثيق: انظر ملفات `/docs`
- المشاكل: استخدم GitHub Issues

---

**النظام جاهز للاستخدام الكامل! 🚀**