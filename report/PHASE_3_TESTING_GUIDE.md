# Phase 3 Testing Quick Start Guide

## Overview
This guide helps you test the newly integrated Products (Medical Services) and Customers (Members) modules.

---

## Prerequisites

### 1. Backend Running
```bash
cd /workspaces/tba-waad-system/backend
mvn spring-boot:run -DskipTests
```
**Wait for:** `Started TbaApplication in X.XXX seconds`

### 2. Frontend Running
```bash
cd /workspaces/tba-waad-system/frontend
npm run dev
```
**Access:** http://localhost:3000

---

## Module 1: Products → Medical Services

### Test List View
1. Navigate to: **E-Commerce → Products → Products List**
   - URL: `/apps/e-commerce/product-list`
2. **Expected:** Table with medical services (Lab Tests, Radiology, etc.)
3. **Verify:**
   - Service names display correctly
   - Prices show in LYD
   - Categories display properly
   - Pagination works
   - Search filters results

### Test Grid View
1. Navigate to: **E-Commerce → Products → Products**
   - URL: `/apps/e-commerce/products`
2. **Expected:** Grid of product cards
3. **Verify:**
   - Cards display service information
   - Filter drawer shows categories
   - Price range filter works
   - Sort options work

### Test Detail View
1. Click any product card or "View" button
   - URL: `/apps/e-commerce/product-details/:id`
2. **Expected:** Detailed service information page
3. **Verify:**
   - Service name and description display
   - Price information correct
   - Category badge shows
   - Images (if any) display

### Test Add New Service
1. Navigate to: **E-Commerce → Products → Add Product**
   - URL: `/apps/e-commerce/add-new-product`
2. **Fill form:**
   - Service Name (English): "Blood Test - Complete"
   - Service Name (Arabic): "فحص دم شامل"
   - Category: Select from dropdown (e.g., "Lab Tests")
   - Price: 150
   - Cost: 100
3. **Click:** "Add Medical Service"
4. **Expected:**
   - Success notification appears
   - Redirects to product list
   - New service appears in list

### Test Backend Endpoints (Optional)
```bash
# List all services
curl http://localhost:8080/api/medical-services

# List all categories
curl http://localhost:8080/api/medical-categories

# Get specific service
curl http://localhost:8080/api/medical-services/1
```

---

## Module 2: Customers → Members

### Test List View
1. Navigate to: **Apps → Customer → Customer List**
   - URL: `/apps/customer/list`
2. **Expected:** Table with member information
3. **Verify:**
   - Member names display correctly
   - Email addresses show
   - Contact numbers formatted
   - Age calculated from date of birth
   - Avatars display (deterministic based on ID)
   - Country shows as "Libya"

### Test Card View
1. Navigate to: **Apps → Customer → Customer Card**
   - URL: `/apps/customer/card`
2. **Expected:** Grid of customer cards
3. **Verify:**
   - Cards display member info
   - Avatars show correctly
   - Progress bar shows (100% for ACTIVE)
   - Order count displays (default 0)

### Test Add Customer Modal
1. Click **"Add Customer"** button
2. **Fill form:**
   - Name: "Ahmed Mohamed"
   - Father Name: "Ahmed"
   - Email: "ahmed@example.ly"
   - Contact: "+218-91-1234567"
   - Location: "Tripoli, Libya"
3. **Click:** "Add"
4. **Expected:**
   - Success notification
   - Modal closes
   - New customer appears in list
   - Age defaults to 30

### Test Edit Customer
1. Click "Edit" icon on any customer
2. **Modify fields:**
   - Change phone number
   - Update address
3. **Click:** "Edit"
4. **Expected:**
   - Success notification
   - Changes reflected in list
   - Modal closes

### Test Delete Customer
1. Click "Delete" icon on any customer
2. **Confirm:** deletion in alert dialog
3. **Expected:**
   - Success notification
   - Customer removed from list
   - Cache updated

### Test Backend Endpoints (Optional)
```bash
# List all members
curl http://localhost:8080/api/members

# Get specific member
curl http://localhost:8080/api/members/1

# Search members
curl "http://localhost:8080/api/members/search?q=Ahmed"
```

---

## Common Issues & Troubleshooting

### Issue: "Port 8080 already in use"
**Solution:**
```bash
# Find process on port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Restart backend
cd /workspaces/tba-waad-system/backend
mvn spring-boot:run -DskipTests
```

### Issue: "Network Error" in Frontend
**Check:**
1. Backend is running on port 8080
2. Frontend proxy configured correctly
3. Check browser console for specific error
4. Verify API endpoint URLs

### Issue: "Category dropdown empty"
**Solution:**
1. Check backend logs for errors
2. Verify medical categories exist in database
3. Test endpoint directly: `curl http://localhost:8080/api/medical-categories`
4. Check console for API errors

### Issue: "Age shows as 30 for all members"
**Reason:** Default fallback when `dateOfBirth` is null
**Solution:** Add date of birth when creating members

### Issue: "No data displays"
**Check:**
1. Backend database has data
2. Network requests succeed (200 status)
3. Browser console for errors
4. React DevTools for component state

---

## Data Verification

### Products Module
**Check transformation working:**
```javascript
// In browser console
localStorage.clear(); // Clear SWR cache
location.reload(); // Reload page

// Check network tab
// Look for: GET /api/medical-services
// Response should have: nameEn, priceLyd, categoryNameEn
// UI should display: name, offerPrice, categories[]
```

### Customers Module
**Check transformation working:**
```javascript
// In browser console
// Inspect customers data
window.swr = require('swr'); // If available

// Check network tab
// Look for: GET /api/members
// Response should have: firstName, lastName, phone, dateOfBirth
// UI should display: name, contact, age, avatar
```

---

## Success Indicators

### Products Module
- ✅ Services display in list and grid
- ✅ Categories load in dropdown
- ✅ Prices show in LYD currency
- ✅ Add form creates services successfully
- ✅ No console errors
- ✅ Network requests return 200

### Customers Module
- ✅ Members display in list and cards
- ✅ Age calculated correctly
- ✅ Avatars show consistently
- ✅ Add/Edit modal works
- ✅ Delete confirmation works
- ✅ No console errors
- ✅ Network requests return 200

---

## Next Steps After Testing

1. **Report Issues:** Document any bugs or unexpected behavior
2. **Test Edge Cases:** Empty states, invalid data, network errors
3. **Performance Check:** Load time, pagination speed
4. **UI Verification:** Confirm zero visual changes to template
5. **Data Integrity:** Verify CRUD operations persist correctly

---

## Contact & Support

**Documentation:**
- Full report: `/report/PHASE_3_UI_INTEGRATION_REPORT.md`
- Backend docs: `/backend/README.md`
- Frontend docs: `/frontend/README.md`

**Key Files:**
- Products adapter: `/frontend/src/api/products.js`
- Customers adapter: `/frontend/src/api/customer.js`
- Medical Services: `/frontend/src/services/api/medicalServicesService.js`
- Members Service: `/frontend/src/services/api/membersService.js`

---

**Happy Testing! 🚀**
