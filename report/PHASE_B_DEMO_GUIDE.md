# 🎯 PHASE B — DEMO GUIDE

## Quick Demo (5 Minutes)

### Step 1: Start Application
```bash
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:3000`

---

### Step 2: Navigate to TBA System

1. Open browser: `http://localhost:3000`
2. Look at left sidebar
3. Find **"TBA System"** menu group
4. See 6 menu items with icons:
   - 📄 Claims
   - 👤 Members
   - 👥 Employers
   - 🛡️ Insurance Companies
   - 🔍 Reviewer Companies
   - 💊 Visits

---

### Step 3: Demo Each Module

#### **Claims Page** (`/tba/claims`)
✅ **What to Show:**
- Table with 3 sample claims
- Status badges (PENDING=orange, APPROVED=green, REJECTED=red)
- Search bar (try searching "Ahmed")
- Pagination controls
- Edit/Delete icons

✅ **CRUD Demo:**
1. Click "Add Claim" → Drawer slides from right
2. Fill form: Claim Number, Member Name, Provider, Date, Status, Amount
3. Click Save → Toast: "Claim created"
4. Click Edit icon → Drawer opens with pre-filled data
5. Modify amount → Save → Toast: "Claim updated"
6. Click Delete → Confirmation → Toast: "Claim deleted"

#### **Members Page** (`/tba/members`)
✅ **What to Show:**
- Table with 3 sample members
- Saudi phone numbers (+966)
- Date of birth field

✅ **Quick Test:**
- Search for "Ali"
- Click "Add Member"
- Show form fields (Number, Name, Email, Phone, DOB)

#### **Employers Page** (`/tba/employers`)
✅ **What to Show:**
- Table with 3 sample employer companies
- Multiline address field in form

#### **Insurance Companies** (`/tba/insurance-companies`)
✅ **What to Show:**
- Table with 2 sample insurance companies
- License number tracking

#### **Reviewer Companies** (`/tba/reviewer-companies`)
✅ **What to Show:**
- Table with 2 sample reviewer companies
- Specialization field

#### **Visits Page** (`/tba/visits`)
✅ **What to Show:**
- Table with 3 sample visits
- Cost with $ formatting
- Visit type dropdown (Consultation, Emergency, Dental, Surgery, Follow Up)
- Date picker
- Diagnosis multiline field

---

## Full Demo Script (10 Minutes)

### Part 1: Navigation (1 min)
"Let me show you the 6 TBA modules we've integrated. In the sidebar, you can see the TBA System menu with all 6 modules: Claims, Members, Employers, Insurance Companies, Reviewer Companies, and Visits."

### Part 2: Claims CRUD (3 min)
"Let's start with Claims management. Here you can see a table with all claims, including claim number, member name, provider, date, status, and amount. Notice the status badges - pending claims are orange, approved are green, and rejected are red."

**Add Claim:**
"I'll add a new claim. Click this button, and a drawer slides out from the right with the form. Fill in the details... and save. Notice the toast notification confirming the claim was created."

**Edit Claim:**
"To edit, I just click the edit icon. The drawer opens with the data pre-filled. I can modify any field... save... and it's updated."

**Delete Claim:**
"Deleting is simple - click the delete icon, confirm, and it's removed."

### Part 3: Search & Pagination (1 min)
"The table has built-in search - I can type any keyword and it filters across all columns. Pagination is automatic - when we have more records, we can change the number of rows per page or navigate between pages."

### Part 4: Other Modules (2 min)
"All other modules follow the same pattern. Members has personal information, Employers tracks companies, Insurance Companies manages insurance providers, Reviewer Companies handles auditors, and Visits records medical visits."

### Part 5: Technical Highlights (2 min)
"From a technical perspective:
- All data has mock fallbacks, so it works without a backend
- RBAC permissions protect each page
- The UI is fully responsive
- Toast notifications provide user feedback
- Forms have validation
- The build is production-ready with 4,515 modules transformed successfully"

### Part 6: Code Quality (1 min)
"The code follows consistent patterns:
- Reusable DataTable component
- Shared CrudDrawer for all forms
- RBACGuard for permissions
- Centralized API layer with JWT authentication
- All TBA code is isolated in the src/tba directory
- Original Mantis template files are untouched"

---

## Demo Checklist

Before starting demo:
- [ ] `npm run dev` is running
- [ ] Browser is open at `localhost:3000`
- [ ] TBA System menu is visible
- [ ] All 6 pages load without errors

During demo, show:
- [ ] Navigation through all 6 modules
- [ ] Full CRUD cycle on Claims page
- [ ] Search functionality
- [ ] Pagination controls
- [ ] Status badges (Claims)
- [ ] Visit type dropdown (Visits)
- [ ] Cost formatting (Visits)
- [ ] Toast notifications
- [ ] Drawer slide animation

Technical points to mention:
- [ ] 4,515 modules built successfully
- [ ] 1,572 lines of TBA code
- [ ] 6 pages, 3 components, 7 services
- [ ] Mock data for independence
- [ ] RBAC permission checks
- [ ] Production ready

---

## Demo Q&A Preparation

### Expected Questions:

**Q: Does it work without the backend?**  
A: Yes! All pages have mock data fallbacks. When the backend is connected, it seamlessly switches to live data.

**Q: Can we add more modules?**  
A: Absolutely. Just follow the same pattern: create API service, create page with DataTable/CrudDrawer, add menu item, add route. Takes about 30 minutes per module.

**Q: What about permissions?**  
A: RBAC is implemented. Each page checks permissions like `claims.view`, `claims.create`, etc. Currently uses localStorage, ready for backend JWT integration.

**Q: Is it mobile responsive?**  
A: Yes, Material-UI provides responsive design out of the box. Tables adapt to smaller screens.

**Q: How do we deploy?**  
A: Run `npm run build` → Upload `dist/` folder to any static host (Vercel, Netlify, S3, etc.).

**Q: What if we need Excel export?**  
A: The CSVExport component is already included. Just add the export button and wire it to the DataTable data.

---

## Demo Environments

### Development Demo (localhost)
```bash
cd frontend
npm run dev
```
Use this for showing mock data and CRUD operations.

### Production Demo (with backend)
```bash
# Terminal 1
cd backend
mvn spring-boot:run

# Terminal 2
cd frontend
echo "VITE_TBA_API_URL=http://localhost:8080/api" > .env
npm run build
npm run preview
```
Use this for showing real API integration.

---

## Demo Success Metrics

At end of demo, show:
- ✅ **Build Status**: `npm run build` → 4,515 modules
- ✅ **Code Stats**: 1,572 lines TBA code
- ✅ **File Count**: 6 pages + 3 components + 7 services
- ✅ **Documentation**: 3 comprehensive reports

---

## Post-Demo Next Steps

1. **QA Testing**: Manual testing checklist in `PHASE_B_COMPLETION_REPORT.md`
2. **Backend Integration**: Connect to Spring Boot API
3. **Advanced Features**: Excel export, advanced filters, bulk operations
4. **Production Deploy**: Build and deploy to staging environment

---

**Demo Duration**: 5-10 minutes  
**Recommended Audience**: Stakeholders, QA team, backend developers  
**Prerequisites**: Node.js 18+, running `npm run dev`  
**Documentation**: See `PHASE_B_COMPLETION_REPORT.md` for details
