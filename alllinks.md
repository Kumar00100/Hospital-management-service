# 🏥 Hospital Management System - All Links

## 🚀 **Frontend Server Information**
- **Base URL**: [http://localhost:5173/](http://localhost:5173/)
- **Status**: ✅ Running and Active
- **Port**: 5173

---

## 📊 **Dashboard Links (All Public for Testing)**

### **1. Admin Dashboard (Control Panel)**
- **URL**: [http://localhost:5173/admin/dashboard](http://localhost:5173/admin/dashboard)
- **Description**: Full system control, user management, statistics
- **Features**: 
  - Statistics overview (patients, doctors, revenue)
  - User management (add/edit/delete users)
  - Department control
  - Appointment oversight
  - System reports and analytics
- **Status**: ✅ Publicly accessible for testing

### **2. Doctor Dashboard**
- **URL**: [http://localhost:5173/doctor/dashboard](http://localhost:5173/doctor/dashboard)
- **Description**: Patient care, appointments, medical records
- **Features**:
  - Dashboard overview
  - Patient management
  - Schedule management
  - Profile settings
  - Medical record forms
- **Status**: ✅ Publicly accessible for testing

### **3. Staff Dashboard**
- **URL**: [http://localhost:5173/staff/dashboard](http://localhost:5173/staff/dashboard)
- **Description**: Patient coordination, appointments, administrative tasks
- **Features**:
  - Patient registration
  - Appointment management
  - Staff coordination
  - Administrative tools
- **Status**: ✅ Publicly accessible for testing

### **4. Patient Dashboard**
- **URL**: [http://localhost:5173/patient/dashboard](http://localhost:5173/patient/dashboard)
- **Description**: Personal health information, appointments, medical records
- **Features**:
  - Personal profile
  - Appointment history
  - Medical records
  - Prescription downloads
  - Feedback submission
- **Status**: ✅ Publicly accessible for testing

---

## 🔐 **Login & Authentication Pages**

### **Admin Login**
- **URL**: [http://localhost:5173/login/admin](http://localhost:5173/login/admin)
- **Test Credentials**: 
  - Email: admin@hospital.com
  - Password: admin123
- **Redirects to**: Admin Dashboard

### **Doctor Login**
- **URL**: [http://localhost:5173/login/doctor](http://localhost:5173/login/doctor)
- **Test Credentials**: 
  - Email: dr.smith@hospital.com
  - Password: doctor123
- **Redirects to**: Doctor Dashboard

### **Staff Login**
- **URL**: [http://localhost:5173/login/staff](http://localhost:5173/login/staff)
- **Test Credentials**: 
  - Email: staff@hospital.com
  - Password: staff123
- **Redirects to**: Staff Dashboard

### **Patient Login**
- **URL**: [http://localhost:5173/login/patient](http://localhost:5173/login/patient)
- **Test Credentials**: 
  - Email: patient1@email.com
  - Password: patient123
- **Redirects to**: Patient Dashboard

---

## 📝 **Registration & Public Pages**

### **Patient Registration**
- **URL**: [http://localhost:5173/register](http://localhost:5173/register)
- **Description**: New patient account creation
- **Features**: 
  - Personal information form
  - Medical history
  - Emergency contacts
  - Account setup

### **Appointment Booking**
- **URL**: [http://localhost:5173/appointment](http://localhost:5173/appointment)
- **Description**: Online appointment scheduling
- **Features**:
  - Department selection
  - Doctor selection
  - Date and time picker
  - Symptom description

### **Dashboard Links Overview**
- **URL**: [http://localhost:5173/dashboards](http://localhost:5173/dashboards)
- **Description**: Central hub for all dashboard types
- **Features**: Links to Admin, Doctor, Staff, and Patient dashboards

---

## 🏥 **Department & Service Pages**

### **Main Departments Page**
- **URL**: [http://localhost:5173/departments](http://localhost:5173/departments)
- **Description**: Overview of all hospital departments

### **Individual Department Pages**
- **Cardiology**: [http://localhost:5173/departments/cardiology](http://localhost:5173/departments/cardiology)
- **Neurology**: [http://localhost:5173/departments/neurology](http://localhost:5173/departments/neurology)
- **Orthopedics**: [http://localhost:5173/departments/orthopedics](http://localhost:5173/departments/orthopedics)
- **Pediatrics**: [http://localhost:5173/departments/pediatrics](http://localhost:5173/departments/pediatrics)
- **Dental**: [http://localhost:5173/departments/dental](http://localhost:5173/departments/dental)

---

## 🏠 **Main Public Pages**

### **Home Page**
- **URL**: [http://localhost:5173/](http://localhost:5173/)
- **Description**: Main landing page with hospital information
- **Features**:
  - Hero slider
  - Services overview
  - Mission and vision
  - Department highlights
  - Doctor profiles
  - Testimonials
  - Contact information

---

## 🔧 **Backend API Endpoints**

### **Health Check**
- **URL**: [http://localhost:5000/health](http://localhost:5000/health)
- **Method**: GET
- **Description**: Server status check

### **Gallery API**
- **URL**: [http://localhost:5000/api/gallery](http://localhost:5000/api/gallery)
- **Method**: GET
- **Description**: Hospital images and photos

### **Appointments API**
- **URL**: [http://localhost:5000/api/appointments](http://localhost:5000/api/appointments)
- **Method**: POST
- **Description**: Create new appointments

---

## 📱 **Quick Access Guide**

### **For Testing (No Login Required)**
1. **[Admin Dashboard](http://localhost:5173/admin/dashboard)**
2. **[Doctor Dashboard](http://localhost:5173/doctor/dashboard)**
3. **[Staff Dashboard](http://localhost:5173/staff/dashboard)**
4. **[Patient Dashboard](http://localhost:5173/patient/dashboard)**

### **For Authentication Testing**
1. **[Admin Login](http://localhost:5173/login/admin)**
2. **[Doctor Login](http://localhost:5173/login/doctor)**
3. **[Staff Login](http://localhost:5173/login/staff)**
4. **[Patient Login](http://localhost:5173/login/patient)**

### **For Public Access**
1. **[Home Page](http://localhost:5173/)**
2. **[Patient Registration](http://localhost:5173/register)**
3. **[Appointment Booking](http://localhost:5173/appointment)**
4. **[Departments](http://localhost:5173/departments)**

---

## 🚨 **Important Notes**

### **Current Status**
- ✅ **All Dashboards**: Publicly accessible for testing
- ✅ **Frontend Server**: Running on port 5174
- ✅ **Backend Server**: Running on port 5000
- ✅ **Database**: MySQL connected and ready

### **Test Credentials**
All login pages include "Use Test Account" buttons that automatically fill in the credentials for testing purposes.

### **Navigation Flow**
1. **Home Page** → Navigation Bar → "Login and Register"
2. **Select Role** → Login Form → Dashboard
3. **Direct Access** → Dashboard URLs (currently public)

---

## 🎯 **Recommended Testing Sequence**

1. **[Start with Home Page](http://localhost:5173/)**
2. **[Test Admin Dashboard](http://localhost:5173/admin/dashboard)**
3. **[Test Doctor Dashboard](http://localhost:5173/doctor/dashboard)**
4. **[Test Patient Registration](http://localhost:5173/register)**
5. **[Test Login Systems](http://localhost:5173/login/admin)** (Use test credentials)
6. **[Test Appointment Booking](http://localhost:5173/appointment)**

---

## 📞 **Support & Troubleshooting**

### **If Dashboards Don't Load**
- Check if frontend server is running on port 5173
- Check if backend server is running on port 5000
- Verify database connection
- Check browser console for errors

### **If Login Fails**
- Use "Use Test Account" buttons
- Verify credentials are correct
- Check backend server status

---

**Last Updated**: Current Session
**System Status**: ✅ All Systems Operational
**Testing Mode**: 🔓 All Dashboards Public
