# TBA-WAAD Health Insurance Platform

A comprehensive Third Party Administrator (TPA) health insurance management system with a React frontend and Spring Boot backend.

## 🏗️ Architecture

This project consists of two main components:

### Frontend (React + TypeScript)
- Modern React 19 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- JWT authentication
- Role-based UI rendering

### Backend (Spring Boot + Java 21)
- Spring Boot 3.2.5 with Java 21
- PostgreSQL database
- JWT authentication & authorization
- RESTful API with Swagger documentation
- Role-based access control (RBAC)

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Setup PostgreSQL Database:**
```bash
# Create database
createdb tba_waad
```

2. **Configure Database:**
Edit `backend/src/main/resources/application.yml` if needed (default credentials: postgres/12345)

3. **Run Backend:**
```bash
cd backend
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`

4. **Access API Documentation:**
Open `http://localhost:8080/swagger-ui.html` in your browser

## 📖 Documentation

- **Backend API Guide:** See [backend/README.md](backend/README.md)
- **Quick Start Guide:** See [backend/QUICKSTART.md](backend/QUICKSTART.md)
- **Product Requirements:** See [PRD.md](PRD.md)

## 🔐 Default Users

The backend automatically creates test users on first run:

| Username  | Password     | Role      |
|-----------|--------------|-----------|
| admin     | admin123     | ADMIN     |
| insurance | insurance123 | INSURANCE |
| provider  | provider123  | PROVIDER  |
| employer  | employer123  | EMPLOYER  |
| member    | member123    | MEMBER    |

## 🛠️ Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- React Hook Form
- Zustand (state management)

### Backend
- Java 21
- Spring Boot 3.2.5
- Spring Security with JWT
- PostgreSQL
- JPA/Hibernate
- Swagger/OpenAPI
- Maven

## 📋 Features

- ✅ User Authentication & Authorization
- ✅ Organization Management
- ✅ Member Management
- ✅ Provider Network Management
- ✅ Claims Processing Workflow
- ✅ Pre-Authorization Approvals
- ✅ Finance & Settlement Tracking
- ✅ Reporting & Analytics
- ✅ Audit Logging
- ✅ Role-Based Access Control

## 🎯 User Roles

- **ADMIN**: Full system access
- **INSURANCE**: Insurance company staff - manage claims, approvals, members
- **PROVIDER**: Healthcare provider - submit claims, view approvals
- **EMPLOYER**: Organization/employer - view members and reports
- **MEMBER**: Insured member - view own claims and approvals

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Core Resources
- `/api/users` - User management
- `/api/organizations` - Organization management
- `/api/members` - Member management
- `/api/providers` - Provider management
- `/api/claims` - Claims processing
- `/api/approvals` - Pre-authorization requests
- `/api/finance` - Financial records
- `/api/reports` - Analytics and reporting

Full API documentation available at `http://localhost:8080/swagger-ui.html`

## 🔧 Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
mvn test
```

### Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
mvn clean package
```

## 📁 Project Structure

```
.
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/waad/tba/
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access
│   │   ├── model/             # JPA entities
│   │   ├── security/          # JWT & security
│   │   ├── config/            # Configuration
│   │   └── dto/               # Data transfer objects
│   ├── src/main/resources/
│   │   └── application.yml    # App configuration
│   └── pom.xml               # Maven dependencies
├── src/                       # React frontend
│   ├── components/           # React components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   └── App.tsx              # Main app component
├── PRD.md                    # Product requirements
└── README.md                 # This file
```

## 🚀 Deployment

### Backend Deployment

1. Set production database credentials
2. Configure JWT secret via environment variable
3. Build and run:
```bash
mvn clean package -DskipTests
java -jar target/tba-backend-1.0.0.jar
```

### Frontend Deployment

1. Build production bundle:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `application.yml`
- Ensure database `tba_waad` exists

### CORS Errors
- Backend is configured for `localhost:5173` and `localhost:3000`
- Update `CorsConfig.java` for production domains

### JWT Token Issues
- Tokens expire after 24 hours by default
- Use the `/api/auth/login` endpoint to get a new token
- Ensure token is sent as `Authorization: Bearer <token>`

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

**Built with ❤️ for healthcare administration**
