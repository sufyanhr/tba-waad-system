# MEDICAL CATEGORIES - QUICK START GUIDE
## TBA-WAAD System Implementation

**Date:** November 23, 2025  
**Module:** Medical Categories  
**Difficulty:** Beginner  

---

## 🚀 5-Minute Quick Start

### Step 1: Run Database Migration

```bash
# Connect to your MySQL database
mysql -u root -p tba_waad_db

# Run the migration script
source /workspaces/tba-waad-system/backend/database/medical_categories_migration.sql

# Verify tables created
SHOW TABLES LIKE 'medical_categories';
SELECT COUNT(*) FROM medical_categories;
```

**Expected Output:** 12 default categories created

---

### Step 2: Start Backend Server

```bash
cd /workspaces/tba-waad-system/backend
mvn clean compile
mvn spring-boot:run
```

**Verify:** Backend starts on port 8080 without errors

---

### Step 3: Test API Endpoints

```bash
# Get all categories
curl http://localhost:8080/api/medical-categories | jq

# Expected response:
{
  "status": "success",
  "message": "Medical categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "LAB",
      "nameAr": "التحاليل المخبرية",
      "nameEn": "Laboratory Tests",
      "description": "Blood tests, urinalysis...",
      "createdAt": "2025-11-23T22:00:00",
      "updatedAt": "2025-11-23T22:00:00"
    },
    ...
  ]
}
```

---

### Step 4: Start Frontend

```bash
cd /workspaces/tba-waad-system/frontend
npm run start
```

**Verify:** Frontend starts on port 3001 without errors

---

### Step 5: Test in Browser

1. **Open:** http://localhost:3001
2. **Login** with your credentials
3. **Navigate to:** Products / Medical Services page
4. **Check:** Categories should load in filters/dropdowns

---

## 📋 Usage Examples

### Backend API Usage

**Create New Category:**
```bash
curl -X POST http://localhost:8080/api/medical-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "ORTHO",
    "nameAr": "العظام",
    "nameEn": "Orthopedics",
    "description": "Bone and joint related services"
  }'
```

**Update Category:**
```bash
curl -X PUT http://localhost:8080/api/medical-categories/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "LAB",
    "nameAr": "التحاليل المخبرية المتقدمة",
    "nameEn": "Advanced Laboratory Tests",
    "description": "Updated description"
  }'
```

**Delete Category:**
```bash
curl -X DELETE http://localhost:8080/api/medical-categories/13 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Frontend JavaScript Usage

**Load Categories in Component:**
```javascript
import { medicalCategoriesService } from 'services/api';

function MedicalServiceForm() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const options = await medicalCategoriesService.getOptions();
      setCategories(options);
    };
    loadCategories();
  }, []);

  return (
    <Select>
      {categories.map(cat => (
        <MenuItem key={cat.value} value={cat.value}>
          {cat.label}
        </MenuItem>
      ))}
    </Select>
  );
}
```

**Filter Medical Services by Category:**
```javascript
import { filterProducts } from 'api/products';

// New way (recommended)
const labServices = await filterProducts({ categoryId: 1 });

// Old way (still works)
const labServices = await filterProducts({ categories: ['lab'] });
```

**Create Medical Service with Category:**
```javascript
import { medicalServicesService } from 'services/api';

const newService = await medicalServicesService.create({
  code: "LAB001",
  nameAr: "تحليل دم شامل",
  nameEn: "Complete Blood Count (CBC)",
  priceLyd: 50.0,
  costLyd: 30.0,
  categoryEntity: { id: 1 } // LAB category
});
```

---

## 🛠️ Common Tasks

### Add Custom Category

**Option 1: Via API**
```bash
curl -X POST http://localhost:8080/api/medical-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "CARDIO",
    "nameAr": "القلب",
    "nameEn": "Cardiology",
    "description": "Heart and cardiovascular services"
  }'
```

**Option 2: Direct SQL**
```sql
INSERT INTO medical_categories (code, name_ar, name_en, description)
VALUES ('CARDIO', 'القلب', 'Cardiology', 'Heart and cardiovascular services');
```

---

### Assign Category to Existing Service

```sql
-- Find category ID
SELECT id FROM medical_categories WHERE code = 'LAB';

-- Update medical service
UPDATE medical_services 
SET category_id = 1 
WHERE id = 123;
```

---

### Bulk Update Services to Category

```sql
-- Assign all lab-related services to LAB category
UPDATE medical_services ms
SET ms.category_id = (SELECT id FROM medical_categories WHERE code = 'LAB')
WHERE LOWER(ms.name_en) LIKE '%blood%'
   OR LOWER(ms.name_en) LIKE '%test%'
   OR LOWER(ms.name_ar) LIKE '%تحليل%';
```

---

## 🐛 Troubleshooting

### Issue: Categories not loading in UI

**Check:**
1. Backend running on port 8080
2. Frontend `.env` has correct `VITE_APP_API_URL=http://localhost:8080`
3. Open browser console for error messages
4. Check network tab for failed API calls

**Solution:**
```bash
# Restart backend
cd backend && mvn spring-boot:run

# Check API manually
curl http://localhost:8080/api/medical-categories
```

---

### Issue: "Category already exists" error

**Reason:** Category codes must be unique

**Solution:**
```sql
-- Check existing codes
SELECT code FROM medical_categories;

-- Use different code or update existing
UPDATE medical_categories 
SET name_en = 'New Name' 
WHERE code = 'LAB';
```

---

### Issue: Cannot delete category

**Reason:** Category has associated medical services

**Solution:**
```sql
-- Find services using this category
SELECT * FROM medical_services WHERE category_id = 5;

-- Option 1: Reassign services to another category
UPDATE medical_services 
SET category_id = 1 
WHERE category_id = 5;

-- Option 2: Delete services first
DELETE FROM medical_services WHERE category_id = 5;

-- Then delete category
DELETE FROM medical_categories WHERE id = 5;
```

---

### Issue: Services showing "Uncategorized"

**Reason:** `category_id` is NULL

**Solution:**
```sql
-- Find uncategorized services
SELECT * FROM medical_services WHERE category_id IS NULL;

-- Assign default category (e.g., OP = Outpatient)
UPDATE medical_services 
SET category_id = (SELECT id FROM medical_categories WHERE code = 'OP')
WHERE category_id IS NULL;
```

---

## 📊 Monitoring & Verification

### Check Category Distribution

```sql
SELECT 
    mc.name_en AS category,
    COUNT(ms.id) AS service_count,
    AVG(ms.price_lyd) AS avg_price,
    SUM(ms.price_lyd) AS total_value
FROM medical_categories mc
LEFT JOIN medical_services ms ON ms.category_id = mc.id
GROUP BY mc.id, mc.name_en
ORDER BY service_count DESC;
```

### Find Most Expensive Services by Category

```sql
SELECT 
    mc.name_en AS category,
    ms.name_en AS service,
    ms.price_lyd AS price
FROM medical_services ms
JOIN medical_categories mc ON ms.category_id = mc.id
ORDER BY ms.price_lyd DESC
LIMIT 20;
```

### Audit Uncategorized Services

```sql
SELECT 
    id,
    code,
    name_en,
    category AS old_category_string
FROM medical_services
WHERE category_id IS NULL;
```

---

## 🔒 Security Notes

### API Authentication

All endpoints require JWT authentication:

```javascript
// Frontend automatically adds token via interceptor
// Check utils/axios.js for implementation

// Manual API call
const token = localStorage.getItem('serviceToken');
fetch('http://localhost:8080/api/medical-categories', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### RBAC Permissions

Categories module respects existing RBAC:

- **VIEW_MEDICAL_CATEGORIES:** Required to list/view categories
- **CREATE_MEDICAL_CATEGORY:** Required to create new categories
- **UPDATE_MEDICAL_CATEGORY:** Required to update categories
- **DELETE_MEDICAL_CATEGORY:** Required to delete categories

---

## 📚 Additional Resources

**Files to Review:**
- Backend Entity: `backend/src/main/java/com/waad/tba/modules/medicalcategory/MedicalCategory.java`
- Frontend Service: `frontend/src/services/api/medicalCategoriesService.js`
- Migration Script: `backend/database/medical_categories_migration.sql`
- Full Report: `MEDICAL_CATEGORIES_IMPLEMENTATION_REPORT.md`

**API Documentation:**
- GET `/api/medical-categories` - List all
- GET `/api/medical-categories/{id}` - Get by ID
- GET `/api/medical-categories/code/{code}` - Get by code
- POST `/api/medical-categories` - Create
- PUT `/api/medical-categories/{id}` - Update
- DELETE `/api/medical-categories/{id}` - Delete

---

## ✅ Checklist

- [ ] Database migration executed
- [ ] Backend compiles without errors
- [ ] Frontend builds without errors
- [ ] API returns categories list
- [ ] UI displays categories in dropdowns
- [ ] Filters work with category selection
- [ ] No console errors in browser
- [ ] JWT authentication working

---

**Quick Start Complete!** 🎉

For detailed implementation details, see `MEDICAL_CATEGORIES_IMPLEMENTATION_REPORT.md`
