# 🚀 TBA WAAD System - Quick Start Guide

**Version**: 1.0.0  
**Date**: December 12, 2025  
**Status**: ✅ Production Ready  

---

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+
- PostgreSQL Client (optional)

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Start Database (30 seconds)
```bash
# Start PostgreSQL container
docker-compose up -d

# Verify container is running
docker ps | grep tba-waad-postgres
```

### 2️⃣ Start Backend (90 seconds)
```bash
cd backend

# Install dependencies & run
mvn spring-boot:run

# Wait for: "Started TbaBackendApplication"
# Backend will be available at: http://localhost:8080
```

### 3️⃣ Initialize Database (30 seconds)
```bash
# Fix PostgreSQL permissions
docker exec -i tba-waad-postgres psql -U postgres -d tba_waad_db \
  < backend/src/main/resources/db/fix-permissions.sql

# Create SUPER_ADMIN user
docker exec -i tba-waad-postgres psql -U postgres -d tba_waad_db \
  < backend/src/main/resources/db/create-super-admin-complete.sql
```

### 4️⃣ Test Backend Authentication (10 seconds)
```bash
# Login as SUPER_ADMIN
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"superadmin@tba.sa","password":"Admin@123"}' | jq .

# Expected: {"success":true,"data":{"token":"eyJ...","user":{...}}}
```

### 5️⃣ Start Frontend (60 seconds)
```bash
cd ../frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm start

# Frontend will be available at: http://localhost:3000
```

### 6️⃣ Access Application (5 seconds)
```
🌐 Open Browser: http://localhost:3000/
📧 Email: superadmin@tba.sa
🔐 Password: Admin@123
```

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Port 3000)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite 7.1.9 + Mantis UI                  │  │
│  │  - JWT Auth                                          │  │
│  │  - RBAC (Zustand)                                    │  │
│  │  - React Router v6                                   │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Spring Boot 3.5.7 + Spring Security 6               │  │
│  │  - JWT Authentication (HS384)                        │  │
│  │  - BCrypt Password Encoding                          │  │
│  │  - RBAC with 28 Permissions                          │  │
│  │  - Hibernate ORM                                     │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │ JDBC
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          PostgreSQL 14 Database (Port 5432)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database: tba_waad_db                               │  │
│  │  - 37 Tables (users, roles, permissions, claims...)  │  │
│  │  - 1 SUPER_ADMIN User                                │  │
│  │  - 28 Core Permissions                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Default Credentials

### SUPER_ADMIN User:
```
Email:    superadmin@tba.sa
Password: Admin@123
Username: superadmin
Role:     SUPER_ADMIN (all permissions)
```

### Database:
```
Host:     localhost
Port:     5432
Database: tba_waad_db
User:     postgres
Password: 12345
```

---

## 🧪 Testing

### Backend Health Check:
```bash
# Check backend is running
curl http://localhost:8080/actuator/health

# Expected: {"status":"UP"}
```

### Authentication Flow:
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"superadmin@tba.sa","password":"Admin@123"}' | jq -r '.data.token')

# 2. Get Current User
curl -s http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# Expected: User object with roles and 28 permissions
```

### Database Query:
```bash
# Check SUPER_ADMIN exists
docker exec tba-waad-postgres psql -U postgres -d tba_waad_db \
  -c "SELECT id, username, email, full_name FROM users WHERE email='superadmin@tba.sa';"

# Expected:
#  id | username   | email              | full_name
# ----+------------+--------------------+------------------------------
#   1 | superadmin | superadmin@tba.sa | System Super Administrator
```

---

## 📁 Project Structure

```
tba-waad-system/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/waad/tba/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── auth/        # JWT Authentication
│   │   │   │   │   ├── rbac/        # Role-Based Access Control
│   │   │   │   │   ├── claims/      # Claims Management
│   │   │   │   │   ├── members/     # Member Management
│   │   │   │   │   └── ...
│   │   │   │   ├── config/          # Security, CORS, etc.
│   │   │   │   └── TbaBackendApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml   # Database config
│   │   │       └── db/
│   │   │           ├── fix-permissions.sql
│   │   │           └── create-super-admin-complete.sql
│   │   └── test/
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Loader.jsx            # Full-screen loader
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── index.jsx             # Router config
│   │   │   ├── LoginRoutes.jsx       # Auth routes
│   │   │   └── MainRoutes.jsx        # Protected routes
│   │   ├── contexts/
│   │   │   └── JWTContext.jsx        # Auth context
│   │   ├── services/
│   │   │   ├── auth/                 # Auth API calls
│   │   │   ├── rbac/                 # RBAC API calls
│   │   │   └── ...
│   │   ├── store/                    # Zustand stores
│   │   ├── App.jsx                   # Root component
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml                # PostgreSQL container
├── PHASE_10_COMPLETE_SYSTEM_RECOVERY_REPORT.md
└── QUICKSTART_GUIDE.md              # This file
```

---

## 🛠️ Development Workflow

### Frontend Hot Reload:
```bash
cd frontend
npm start

# Edit src/**/*.jsx files
# Browser auto-reloads on save
```

### Backend Hot Reload (Spring Boot DevTools):
```bash
cd backend
mvn spring-boot:run

# Edit Java files
# App auto-restarts on save
```

### Database Changes:
```bash
# 1. Update Entity classes in backend/src/main/java/.../entity/

# 2. Restart backend (Hibernate will update schema)
mvn spring-boot:run

# 3. Or run SQL manually:
docker exec -i tba-waad-postgres psql -U postgres -d tba_waad_db < your-script.sql
```

---

## 🐛 Troubleshooting

### Backend won't start:
```bash
# Check if port 8080 is already in use
lsof -i :8080

# Kill process if needed
kill -9 <PID>

# Check database connection
docker logs tba-waad-postgres
```

### Frontend blank screen:
```bash
# 1. Clear browser cache and localStorage
# Open browser console: localStorage.clear(); location.reload();

# 2. Check backend is running
curl http://localhost:8080/actuator/health

# 3. Check Vite logs
npm start  # Look for compilation errors
```

### Login fails with "Invalid credentials":
```bash
# 1. Verify SUPER_ADMIN exists
docker exec tba-waad-postgres psql -U postgres -d tba_waad_db \
  -c "SELECT id, email, is_active FROM users WHERE email='superadmin@tba.sa';"

# 2. Reset password if needed
docker exec -i tba-waad-postgres psql -U postgres -d tba_waad_db \
  < backend/src/main/resources/db/create-super-admin-complete.sql

# 3. Check backend logs
# Look for: "Failed to authenticate since password does not match"
```

### Database permission errors:
```bash
# Re-run permissions script
docker exec -i tba-waad-postgres psql -U postgres -d tba_waad_db \
  < backend/src/main/resources/db/fix-permissions.sql
```

---

## 🔄 Reset Everything (Fresh Start)

```bash
# 1. Stop all services
docker-compose down -v  # -v removes volumes (DATA LOSS!)
pkill -f "spring-boot:run"

# 2. Remove database data (optional)
docker volume rm tba-waad-system_postgres_data

# 3. Restart from Step 1 of Quick Start
docker-compose up -d
cd backend && mvn spring-boot:run
# ... continue with steps 3-6
```

---

## 📚 Additional Documentation

- [PHASE_10_COMPLETE_SYSTEM_RECOVERY_REPORT.md](PHASE_10_COMPLETE_SYSTEM_RECOVERY_REPORT.md) - Complete system recovery details
- [AUTHENTICATION_RBAC_IMPLEMENTATION.md](AUTHENTICATION_RBAC_IMPLEMENTATION.md) - RBAC architecture
- [CLAIMS_API_QUICKSTART.md](CLAIMS_API_QUICKSTART.md) - Claims module guide
- [EMPLOYERS_QUICKSTART.md](EMPLOYERS_QUICKSTART.md) - Employers module guide

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review [PHASE_10_COMPLETE_SYSTEM_RECOVERY_REPORT.md](PHASE_10_COMPLETE_SYSTEM_RECOVERY_REPORT.md)
- Contact: TBA Development Team

---

## ✅ Verification Checklist

After setup, verify all components:

- [ ] PostgreSQL container running (`docker ps`)
- [ ] Backend started (`curl http://localhost:8080/actuator/health`)
- [ ] SUPER_ADMIN user exists (SQL query above)
- [ ] Login works (`curl` test above)
- [ ] Token validation works (`/auth/me` endpoint)
- [ ] Frontend loads (`http://localhost:3000/`)
- [ ] Login page renders (no blank screen)
- [ ] Can login via UI (superadmin@tba.sa / Admin@123)
- [ ] Dashboard loads after login

---

**🎉 Setup Complete! Happy Coding!** 🚀

---

**Last Updated**: 2025-12-12  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
