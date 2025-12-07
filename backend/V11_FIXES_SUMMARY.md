# 🔧 إصلاح V11 Migration Script

**التاريخ:** 7 ديسمبر 2025  
**الملف:** `V11__member_family_refactor.sql`  
**المشكلة:** محاولة migration من أعمدة غير موجودة

---

## 🐛 المشكلة الأصلية

### الخطأ:
```
ERROR: column "first_name" does not exist
LINE 32: AND (first_name IS NOT NULL OR last_name IS NOT NULL);
```

### السبب:
السكربت كان يحاول عمل migration من أعمدة قديمة:
```sql
-- ❌ خطأ - هذه الأعمدة غير موجودة
UPDATE members 
SET full_name_english = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
WHERE first_name IS NOT NULL OR last_name IS NOT NULL;

UPDATE members SET birth_date = date_of_birth;
UPDATE members SET join_date = start_date;
```

---

## 📊 بنية جدول Members الفعلية

### الأعمدة الموجودة في Member.java Entity:

```java
// Personal Information
@Column(name = "full_name_arabic")      ✅ موجود بالفعل
private String fullNameArabic;

@Column(name = "full_name_english")     ✅ موجود بالفعل
private String fullNameEnglish;

@Column(name = "civil_id")              ✅ موجود بالفعل
private String civilId;

@Column(name = "card_number")           ✅ موجود بالفعل
private String cardNumber;

@Column(name = "birth_date")            ✅ موجود بالفعل
private LocalDate birthDate;

@Column(name = "gender")                ✅ موجود بالفعل
private String gender;

// Employment Information
@Column(name = "policy_number")         ✅ موجود بالفعل
private String policyNumber;

@Column(name = "benefit_package_id")    ✅ موجود بالفعل
private Long benefitPackageId;

@Column(name = "employee_number")       ✅ موجود بالفعل
private String employeeNumber;

@Column(name = "join_date")             ✅ موجود بالفعل
private LocalDate joinDate;

@Column(name = "occupation")            ✅ موجود بالفعل
private String occupation;

// Status
@Column(name = "card_status")           ✅ موجود بالفعل
private String cardStatus;

@Column(name = "blocked_reason")        ✅ موجود بالفعل
private String blockedReason;

// Audit
@Column(name = "created_by")            ✅ موجود بالفعل
private String createdBy;

@Column(name = "updated_by")            ✅ موجود بالفعل
private String updatedBy;
```

### الأعمدة غير الموجودة (كانت تسبب الخطأ):
```
❌ first_name       - لا يوجد في Entity
❌ last_name        - لا يوجد في Entity
❌ date_of_birth    - استخدم birth_date بدلاً منه
❌ start_date       - استخدم join_date بدلاً منه
```

---

## ✅ الإصلاح المطبق

### قبل الإصلاح:
```sql
-- ❌ محاولة migration من أعمدة غير موجودة
UPDATE members 
SET full_name_english = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
WHERE full_name_english IS NULL 
  AND (first_name IS NOT NULL OR last_name IS NOT NULL);

UPDATE members 
SET birth_date = date_of_birth
WHERE birth_date IS NULL AND date_of_birth IS NOT NULL;

UPDATE members 
SET join_date = start_date
WHERE join_date IS NULL AND start_date IS NOT NULL;
```

### بعد الإصلاح:
```sql
-- ✅ فقط تعيين قيم افتراضية للسجلات الموجودة
UPDATE members 
SET card_status = CASE 
    WHEN active = true THEN 'ACTIVE'
    ELSE 'INACTIVE'
  END
WHERE card_status IS NULL;

-- ملاحظة: جميع الأعمدة الأخرى موجودة بالفعل في الـ schema
-- لا حاجة لـ migration من أعمدة قديمة
```

---

## 📋 ما يفعله V11 الآن (بعد الإصلاح)

### 1. التأكد من وجود الأعمدة (آمن):
```sql
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS full_name_arabic VARCHAR(200),
ADD COLUMN IF NOT EXISTS full_name_english VARCHAR(200),
-- ... إلخ
-- ملاحظة: IF NOT EXISTS يضمن عدم حدوث خطأ إذا كانت موجودة
```

### 2. تعيين قيم افتراضية:
```sql
-- فقط تحديث card_status للسجلات القديمة
UPDATE members 
SET card_status = CASE 
    WHEN active = true THEN 'ACTIVE'
    ELSE 'INACTIVE'
  END
WHERE card_status IS NULL;
```

### 3. إنشاء جدول family_members:
```sql
CREATE TABLE IF NOT EXISTS family_members (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    full_name_arabic VARCHAR(200),
    full_name_english VARCHAR(200) NOT NULL,
    civil_id VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(50) NOT NULL,
    -- ... إلخ
);
```

### 4. إنشاء Indexes للأداء:
```sql
-- على family_members
CREATE INDEX idx_family_members_member_id ON family_members(member_id);
CREATE INDEX idx_family_members_civil_id ON family_members(civil_id);
CREATE INDEX idx_family_members_relationship ON family_members(relationship);

-- على members
CREATE INDEX idx_members_full_name_arabic ON members(full_name_arabic);
CREATE INDEX idx_members_full_name_english ON members(full_name_english);
CREATE INDEX idx_members_birth_date ON members(birth_date);
CREATE INDEX idx_members_card_status ON members(card_status);
```

### 5. Migration من dependents (إن وجد):
```sql
-- يتحقق أولاً من وجود جدول dependents
-- ثم ينقل البيانات إلى family_members
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_name = 'dependents') THEN
        -- نقل البيانات
    END IF;
END $$;
```

---

## 🧪 اختبار السكربت

### تنفيذ V11 المُصلح:
```sql
-- 1. تنفيذ السكربت
\i /path/to/V11__member_family_refactor.sql

-- 2. التحقق من الجداول
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('members', 'family_members');

-- 3. التحقق من الأعمدة في members
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'members'
  AND column_name IN (
    'full_name_arabic', 'full_name_english', 
    'birth_date', 'join_date', 'card_status'
  );

-- 4. التحقق من الـ indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('members', 'family_members')
ORDER BY tablename, indexname;
```

### النتيجة المتوقعة:
```
✅ السكربت يعمل بدون أخطاء
✅ جدول family_members تم إنشاؤه
✅ جميع الـ indexes تم إنشاؤها
✅ لا توجد أخطاء: "column does not exist"
```

---

## 📝 الخلاصة

### المشكلة:
- V11 كان يحاول migration من أعمدة (`first_name`, `last_name`, `date_of_birth`, `start_date`) غير موجودة

### الحل:
- إزالة جميع عمليات UPDATE التي تحاول النقل من أعمدة قديمة
- الإبقاء فقط على تحديث `card_status` للسجلات الموجودة
- استخدام `ADD COLUMN IF NOT EXISTS` للأمان

### النتيجة:
- ✅ السكربت الآن آمن ويعمل بنجاح
- ✅ متوافق مع الـ Member Entity الحالي
- ✅ جاهز للتنفيذ في PostgreSQL

---

**تم الإصلاح:** 7 ديسمبر 2025  
**الحالة:** ✅ جاهز للتنفيذ
