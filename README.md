##frontend
cd frontend
npm run dev


##backend
cd backend
npm run dev


## DataBase 
cd backend 
npm run setup


# 🏥 Vitalis Vista - Hospital Management System

A comprehensive **Hospital Management System** with a modern frontend website for public visitors and a powerful backend API for internal operations.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [How to Run](#how-to-run)
- [How It Works](#how-it-works)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

**Vitalis Vista** is a full-stack hospital management solution that consists of:

- **🌐 Public Website**: For patients, visitors, and general public
- **🔐 Internal Dashboard**: For hospital staff, doctors, and administrators
- **⚡ Backend API**: RESTful API server with MySQL database
- **🛡️ Security System**: Role-based access control and authentication

## ✨ Features

### 🌐 Public Website Features
- **Modern UI/UX** with responsive design
- **Hospital Information** (departments, services, mission/vision)
- **Doctor Directory** with profiles and specializations
- **Online Appointment Booking** system
- **Gallery** of hospital facilities and equipment
- **Patient Testimonials** and reviews
- **Contact Information** and location details

### 🔐 Internal System Features
- **Multi-role Authentication** (Admin, Doctor, Staff, Patient)
- **Patient Management** (registration, medical records, history)
- **Appointment Management** (booking, scheduling, status tracking)
- **Doctor Management** (profiles, schedules, availability)
- **Department Management** (specialties, staff assignment)
- **Prescription System** (medical notes, medications)
- **Feedback & Rating** system
- **Reporting & Analytics** dashboard

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for modern styling
- **Shadcn UI** components for consistent design
- **React Router DOM** for navigation
- **React Hooks** for state management

### Backend
- **Node.js** with **Express.js** framework (core web framework)
- **MySQL** database with mysql2 driver
- **JWT** for authentication and authorization
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Express Validator** for input validation
- **CORS** for cross-origin requests

### Database
- **MySQL 8.0+** with relational design
- **Foreign Key Constraints** for data integrity
- **Indexed Queries** for performance
- **Transaction Support** for data consistency

## 📁 Project Structure

```
H/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   ├── config/             # Database configuration
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API route handlers
│   ├── scripts/            # Database scripts
│   └── package.json        # Backend dependencies
│
└── README.md               # This file
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git** for version control

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd H
```

### Step 2: Database Setup
1. **Start MySQL service**
2. **Create database:**
   ```sql
   CREATE DATABASE vitalis_vista;
   ```

### Step 3: Backend Setup
```bash
cd backend
npm install
```

3. **Create environment file:**
   ```bash
   # Create .env file with your database credentials
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=2001
   DB_NAME=vitalis_vista
   DB_PORT=3306
   PORT=5000
   JWT_SECRET=vitalis_vista_jwt_secret_key_2024
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   npm run seed
   ```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏃‍♂️ How to Run

### Start Backend Server
```bash
cd backend
npm run dev          # Development mode with nodemon
# OR
npm start            # Production mode
```

**Backend will run on:** `http://localhost:5000`

### Start Frontend Application
```bash
cd frontend
npm run dev          # Development mode
# OR
npm run build        # Build for production
npm run preview      # Preview production build
```

**Frontend will run on:** `http://localhost:5173`

## 🔄 How It Works

### System Architecture
```
┌─────────────┐    HTTP/HTTPS    ┌─────────────┐    SQL Queries    ┌─────────────┐
│   Frontend  │ ◄──────────────► │   Backend   │ ◄──────────────► │   MySQL     │
│  (React)    │                  │(Node.js +   │                  │  Database   │
│             │                  │ Express.js) │                  │             │
└─────────────┘                  └─────────────┘                  └─────────────┘
```

### Data Flow
1. **User interacts** with React frontend
2. **Frontend makes API calls** to Node.js + Express.js backend
3. **Express.js processes requests** and queries MySQL database
4. **Database returns data** to Express.js backend
5. **Backend sends response** to frontend
6. **Frontend updates UI** with received data

### Authentication Flow
1. **User registers/logs in** → Backend validates credentials
2. **Backend generates JWT token** → Returns to frontend
3. **Frontend stores token** → Uses for authenticated requests
4. **Backend validates token** → Processes protected requests
5. **Role-based access control** → Different permissions for different users

## 👥 User Guide

### For Public Visitors
1. **Browse Hospital Information**
   - View departments and services
   - See doctor profiles and specializations
   - Check hospital facilities in gallery

2. **Book Appointments**
   - Fill appointment form
   - Select department and doctor
   - Choose preferred date and time
   - Submit booking request

3. **Contact Hospital**
   - Use contact form
   - View hospital location and hours
   - Access emergency contact information

### For Registered Patients
1. **Create Account**
   - Register with personal information
   - Verify email and set password
   - Complete patient profile

2. **Manage Appointments**
   - Book new appointments
   - View appointment history
   - Cancel or reschedule appointments
   - Receive appointment confirmations

3. **Access Medical Records**
   - View medical history
   - Download prescriptions
   - Track treatment progress
   - Give feedback and ratings

### For Hospital Staff
1. **Patient Management**
   - Register new patients
   - Update patient information
   - Manage patient records
   - Handle walk-in appointments

2. **Appointment Coordination**
   - View daily appointment schedule
   - Manage doctor availability
   - Handle appointment conflicts
   - Send appointment reminders

### For Doctors
1. **Patient Care**
   - View assigned patients
   - Access medical history
   - Write prescriptions
   - Update treatment plans

2. **Schedule Management**
   - Set availability hours
   - Block leave dates
   - Manage consultation slots
   - View patient appointments

### For Administrators
1. **System Management**
   - Manage user accounts
   - Control system access
   - Monitor system performance
   - Generate reports

2. **Hospital Operations**
   - Manage departments
   - Assign staff roles
   - Monitor appointments
   - Track patient statistics

## 🔌 API Documentation

### Public Endpoints
- `GET /api/health` - Server health check
- `GET /api/gallery` - Hospital gallery images
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### Protected Endpoints
- `GET /api/users/profile` - Get user profile
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/doctors` - Get doctor list
- `GET /api/departments` - Get department list

### Authentication
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **departments** - Hospital departments
- **doctors** - Doctor profiles and specializations
- **patients** - Patient information and medical history
- **appointments** - Appointment bookings and scheduling
- **prescriptions** - Medical prescriptions and notes
- **feedbacks** - Patient feedback and ratings
- **gallery** - Hospital images and media

### Key Relationships
- Users → Patients (one-to-one)
- Users → Doctors (one-to-one)
- Departments → Doctors (one-to-many)
- Patients → Appointments (one-to-many)
- Doctors → Appointments (one-to-many)

## 🛡️ Security Features

### Authentication & Authorization
- **JWT-based authentication** with secure token storage
- **Role-based access control** (Admin, Doctor, Staff, Patient)
- **Password hashing** using bcrypt with salt rounds
- **Session management** with automatic expiration

### Input Validation & Security
- **SQL injection prevention** with parameterized queries
- **Input sanitization** and validation
- **Rate limiting** for login attempts
- **CORS protection** for cross-origin requests

### Data Protection
- **Encrypted passwords** in database
- **Secure headers** (XSS protection, clickjacking prevention)
- **Audit logging** for security monitoring
- **Environment-based configuration** for different deployments

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start
- **Port already in use**: Change PORT in .env file
- **Database connection failed**: Check MySQL credentials and service
- **Missing dependencies**: Run `npm install` in backend directory

#### Frontend Won't Start
- **Port conflicts**: Check if port 5173 is available
- **Missing dependencies**: Run `npm install` in frontend directory
- **Build errors**: Check TypeScript compilation errors

#### Database Issues
- **Migration failed**: Ensure MySQL is running and credentials are correct
- **Tables not created**: Run `npm run migrate` in backend directory
- **Sample data missing**: Run `npm run seed` in backend directory

#### Authentication Problems
- **Login fails**: Check user credentials in database
- **Token expired**: Re-login to get new token
- **Permission denied**: Verify user role and permissions

### Getting Help
1. **Check console logs** for error messages
2. **Verify environment variables** in .env files
3. **Ensure all services are running** (MySQL, Node.js)
4. **Check network connectivity** between frontend and backend

## 🚀 Deployment

### Production Setup
1. **Build frontend**: `npm run build`
2. **Set production environment variables**
3. **Use PM2 or similar** for Node.js process management
4. **Configure reverse proxy** (Nginx/Apache)
5. **Set up SSL certificates** for HTTPS
6. **Configure database backups**

### Environment Variables
```bash
NODE_ENV=production
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-secure-jwt-secret
```

## 📝 License

This project is developed for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Check the troubleshooting section above
- Review console logs and error messages
- Ensure all prerequisites are met
- Verify environment configuration

---

**🎉 Congratulations!** You now have a fully functional Hospital Management System running on your local machine. The system provides a modern, secure, and scalable solution for hospital operations with both public-facing and internal administrative capabilities.


##see resister user details inn terminal use command 
 cd backend
 mysql -u root -p2001 -e "USE hospital_management; SELECT * FROM users;"#   H o s p i t a l - m a n a g e m e n t - s e r v i c e  
 