# 🏥 Hospital Management System - Database Setup Guide

## 🚀 **Quick Setup (Recommended)**

Run this single command to set up everything:
```bash
npm run setup
```

This will:
1. ✅ Create the database
2. ✅ Create all tables
3. ✅ Insert sample data

---

## 📋 **Step-by-Step Setup**

### **Step 1: Environment Configuration**

1. **Copy the config file:**
   ```bash
   # Copy config.env to .env
   cp config.env .env
   ```

2. **Edit .env file with your MySQL credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root          # Your MySQL username
   DB_PASSWORD=          # Your MySQL password (leave empty if none)
   DB_NAME=hospital_management
   ```

### **Step 2: Database Creation**

```bash
npm run setup-db
```

### **Step 3: Create Tables**

```bash
npm run migrate
```

### **Step 4: Insert Sample Data**

```bash
npm run seed
```

---

## 🔧 **Manual MySQL Setup (Alternative)**

If you prefer to set up manually:

### **1. Connect to MySQL**
```bash
mysql -u root -p
```

### **2. Create Database**
```sql
CREATE DATABASE hospital_management;
USE hospital_management;
```

### **3. Run Setup Scripts**
```bash
npm run migrate
npm run seed
```

---

## 📊 **What Gets Created**

### **Tables:**
- ✅ `users` - User accounts (admin, doctors, staff, patients)
- ✅ `departments` - Hospital departments
- ✅ `doctors` - Doctor profiles and specializations
- ✅ `patients` - Patient information
- ✅ `appointments` - Appointment scheduling
- ✅ `prescriptions` - Medical prescriptions
- ✅ `feedbacks` - Patient feedback and ratings
- ✅ `staff` - Staff member details
- ✅ `gallery` - Hospital images
- ✅ `audit_log` - System activity tracking

### **Sample Data:**
- ✅ **Admin User**: admin@vitalis.com / admin123
- ✅ **Doctors**: 5 doctors across different departments
- ✅ **Staff**: 2 staff members
- ✅ **Patients**: 3 sample patients
- ✅ **Departments**: Cardiology, Neurology, Orthopedics, Pediatrics, Dental
- ✅ **Appointments**: Sample appointments
- ✅ **Feedbacks**: Patient reviews

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. "Access denied for user"**
- Check MySQL username/password in `.env`
- Ensure MySQL user has CREATE privileges

#### **2. "Connection refused"**
- Make sure MySQL service is running
- Check if MySQL is on the correct port (default: 3306)

#### **3. "Database doesn't exist"**
- Run `npm run setup-db` first
- Check database name in `.env`

#### **4. "Table already exists"**
- This is normal, tables are created with `IF NOT EXISTS`

---

## 🎯 **Verification**

After setup, verify everything works:

1. **Check Database:**
   ```bash
   mysql -u root -p -e "USE hospital_management; SHOW TABLES;"
   ```

2. **Check Sample Data:**
   ```bash
   mysql -u root -p -e "USE hospital_management; SELECT * FROM users LIMIT 5;"
   ```

3. **Start Backend Server:**
   ```bash
   npm run dev
   ```

4. **Test API Endpoints:**
   - Health check: http://localhost:5000/health
   - Users: http://localhost:5000/api/users

---

## 🔐 **Default Login Credentials**

### **Admin Dashboard:**
- Email: admin@vitalis.com
- Password: admin123

### **Doctor Login:**
- Email: sarah.johnson@vitalis.com
- Password: doctor123

### **Staff Login:**
- Email: john.smith@vitalis.com
- Password: staff123

### **Patient Login:**
- Email: alice.johnson@email.com
- Password: patient123

---

## 📞 **Need Help?**

If you encounter issues:

1. **Check MySQL Status:**
   ```bash
   # Windows
   net start mysql
   
   # Linux/Mac
   sudo systemctl status mysql
   ```

2. **Verify MySQL Connection:**
   ```bash
   mysql -u root -p -e "SELECT VERSION();"
   ```

3. **Check Logs:**
   - Look for error messages in the terminal
   - Check MySQL error logs

---

**🎉 Happy Coding! Your Hospital Management System database will be ready in minutes!**
