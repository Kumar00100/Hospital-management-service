const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

const insertSampleData = async () => {
  try {
    console.log('Starting to insert sample data...');

    // Clear existing data first to avoid duplicates
    console.log('🧹 Clearing existing data...');
    await pool.execute('DELETE FROM feedbacks');
    await pool.execute('DELETE FROM appointments');
    await pool.execute('DELETE FROM patients');
    await pool.execute('DELETE FROM doctors');
    await pool.execute('DELETE FROM staff');
    await pool.execute('DELETE FROM users');
    await pool.execute('DELETE FROM departments');
    await pool.execute('DELETE FROM gallery');
    console.log('✅ Existing data cleared');

    const departments = [
      { name: 'Cardiology', description: 'Heart and cardiovascular care specialists providing comprehensive cardiac care from prevention to advanced surgical procedures.' },
      { name: 'Neurology', description: 'Brain and nervous system specialists using advanced diagnostic technologies for neurological disorders.' },
      { name: 'Orthopedics', description: 'Bone and joint care specialists providing comprehensive musculoskeletal system care and surgical procedures.' },
      { name: 'Pediatrics', description: "Children's healthcare specialists dedicated to providing comprehensive healthcare for children from birth through adolescence." },
      { name: 'Dental', description: 'Oral health and dentistry specialists providing comprehensive oral healthcare services using latest technology.' },
      { name: 'Surgery', description: 'Surgical specialists performing a wide range of operative procedures for various medical conditions.' },
      { name: 'Ophthalmology', description: 'Eye care specialists providing comprehensive vision care and treatment for eye diseases.' },
      { name: 'ENT', description: 'Ear, Nose, and Throat specialists treating disorders of the head and neck region.' },
      { name: 'Dermatology', description: 'Skin care specialists diagnosing and treating skin, hair, and nail conditions.' },
      { name: 'Gynecology', description: "Women's health specialists focusing on the female reproductive system and women's health issues." },
      { name: 'Urology', description: 'Urinary tract and male reproductive system specialists providing comprehensive urological care.' },
      { name: 'Psychiatry', description: 'Mental health specialists diagnosing and treating mental, emotional, and behavioral disorders.' },
      { name: 'Radiology', description: 'Medical imaging specialists using advanced technologies for diagnosis and treatment planning.' },
      { name: 'Emergency Medicine', description: 'Emergency care specialists providing immediate medical attention for acute illnesses and injuries.' },
      { name: 'Internal Medicine', description: 'General medicine specialists providing comprehensive care for adult patients with complex medical conditions.' }
    ];

    for (const dept of departments) {
      await pool.execute('INSERT INTO departments (name, description) VALUES (?, ?)', [dept.name, dept.description]);
    }
    console.log('✅ Departments inserted');

    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.execute('INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, 1)', ['John Admin', 'admin@hospital.com', adminPassword, 'admin']);
    console.log('✅ Admin user inserted');

    const doctors = [
      { name: 'Dr. Sarah Smith', email: 'dr.smith@hospital.com', password: 'doctor123', department: 'Cardiology', qualification: 'MBBS, MD (Cardiology)', experience: '15 years', availability: 'Mon-Fri: 9AM-5PM', bio: 'Interventional Cardiologist with expertise in cardiac catheterization and angioplasty procedures.' },
      { name: 'Dr. Michael Johnson', email: 'dr.johnson@hospital.com', password: 'doctor123', department: 'Neurology', qualification: 'MBBS, MD (Neurology)', experience: '18 years', availability: 'Mon-Fri: 9AM-5PM', bio: 'Neurologist specializing in stroke care and neurological disorders with extensive research experience.' },
      { name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@hospital.com', password: 'doctor123', department: 'Orthopedics', qualification: 'MBBS, MS (Orthopedics)', experience: '16 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'Orthopedic Surgeon with expertise in joint replacement and sports medicine.' },
      { name: 'Dr. James Wilson', email: 'james.wilson@hospital.com', password: 'doctor123', department: 'Pediatrics', qualification: 'MBBS, MD (Pediatrics)', experience: '20 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'Pediatrician with 20 years of experience in child healthcare and development.' },
      { name: 'Dr. Lisa Thompson', email: 'lisa.thompson@hospital.com', password: 'doctor123', department: 'Dental', qualification: 'BDS, MDS (Dental Surgery)', experience: '18 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'General Dentist with expertise in cosmetic dentistry and oral surgery.' },
      { name: 'Dr. Robert Davis', email: 'robert.davis@hospital.com', password: 'doctor123', department: 'Surgery', qualification: 'MBBS, MS (General Surgery)', experience: '22 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'General Surgeon with extensive experience in abdominal and laparoscopic surgeries.' },
      { name: 'Dr. Jennifer Lee', email: 'jennifer.lee@hospital.com', password: 'doctor123', department: 'Ophthalmology', qualification: 'MBBS, MS (Ophthalmology)', experience: '17 years', availability: 'Mon-Fri: 9AM-5PM', bio: 'Ophthalmologist specializing in cataract surgery and retinal diseases.' },
      { name: 'Dr. David Kim', email: 'david.kim@hospital.com', password: 'doctor123', department: 'ENT', qualification: 'MBBS, MS (ENT)', experience: '19 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'ENT Specialist with expertise in sinus surgery and hearing disorders.' },
      { name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hospital.com', password: 'doctor123', department: 'Dermatology', qualification: 'MBBS, MD (Dermatology)', experience: '14 years', availability: 'Mon-Fri: 9AM-5PM', bio: 'Dermatologist specializing in skin cancer treatment and cosmetic dermatology.' },
      { name: 'Dr. Michael Chen', email: 'michael.chen@hospital.com', password: 'doctor123', department: 'Gynecology', qualification: 'MBBS, MD (Gynecology)', experience: '21 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'Gynecologist with expertise in women health and minimally invasive surgeries.' },
      { name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez2@hospital.com', password: 'doctor123', department: 'Urology', qualification: 'MBBS, MS (Urology)', experience: '16 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'Urologist specializing in kidney stones and prostate diseases.' },
      { name: 'Dr. James Wilson', email: 'james.wilson2@hospital.com', password: 'doctor123', department: 'Psychiatry', qualification: 'MBBS, MD (Psychiatry)', experience: '18 years', availability: 'Mon-Fri: 9AM-5PM', bio: 'Psychiatrist specializing in mood disorders and cognitive behavioral therapy.' },
      { name: 'Dr. Lisa Thompson', email: 'lisa.thompson2@hospital.com', password: 'doctor123', department: 'Radiology', qualification: 'MBBS, MD (Radiology)', experience: '15 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'Radiologist with expertise in MRI and CT scan interpretations.' },
      { name: 'Dr. Robert Davis', email: 'robert.davis2@hospital.com', password: 'doctor123', department: 'Emergency Medicine', qualification: 'MBBS, MD (Emergency Medicine)', experience: '12 years', availability: '24/7 Rotational', bio: 'Emergency Medicine Specialist trained in trauma care and critical emergencies.' },
      { name: 'Dr. Jennifer Lee', email: 'jennifer.lee2@hospital.com', password: 'doctor123', department: 'Internal Medicine', qualification: 'MBBS, MD (Internal Medicine)', experience: '20 years', availability: 'Mon-Fri: 8AM-6PM', bio: 'Internal Medicine Specialist providing comprehensive care for complex medical conditions.' }
    ];

    for (const doctor of doctors) {
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      const [userResult] = await pool.execute('INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, 1)', [doctor.name, doctor.email, hashedPassword, 'doctor']);
      const [deptResult] = await pool.execute('SELECT id FROM departments WHERE name = ?', [doctor.department]);
      await pool.execute('INSERT INTO doctors (user_id, department_id, qualification, experience, availability, bio) VALUES (?, ?, ?, ?, ?, ?)', [userResult.insertId, deptResult[0].id, doctor.qualification, doctor.experience, doctor.availability, doctor.bio]);
    }
    console.log('✅ Doctors inserted');

    const staffMembers = [
      { name: 'Emily Receptionist', email: 'staff@hospital.com', password: 'staff123', department: 'Cardiology', phone: '+1-555-0104', shift_time: 'Morning Shift (6AM-2PM)' },
      { name: 'Maria Garcia', email: 'maria.garcia@hospital.com', password: 'staff123', department: 'Neurology', phone: '+1-555-0102', shift_time: 'Evening Shift (2PM-10PM)' }
    ];

    for (const staff of staffMembers) {
      const hashedPassword = await bcrypt.hash(staff.password, 10);
      const [userResult] = await pool.execute('INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, 1)', [staff.name, staff.email, hashedPassword, 'staff']);
      const [deptResult] = await pool.execute('SELECT id FROM departments WHERE name = ?', [staff.department]);
      await pool.execute('INSERT INTO staff (user_id, department_id, phone, shift_time) VALUES (?, ?, ?, ?)', [userResult.insertId, deptResult[0].id, staff.phone, staff.shift_time]);
    }
    console.log('✅ Staff members inserted');

    const patients = [
      { name: 'Alice Brown', email: 'patient1@email.com', password: 'patient123', age: 35, gender: 'Female', phone: '+1-555-0105', address: '123 Main St, New York, NY 10001', blood_group: 'O+' },
      { name: 'David Wilson', email: 'patient2@email.com', password: 'patient123', age: 42, gender: 'Male', phone: '+1-555-0107', address: '456 Oak Ave, Los Angeles, CA 90001', blood_group: 'A-' },
      { name: 'Carol Davis', email: 'carol.davis@email.com', password: 'patient123', age: 28, gender: 'Female', phone: '+1-555-0203', address: '789 Pine Rd, City, State 12345', blood_group: 'B+' }
    ];

    for (const patient of patients) {
      const hashedPassword = await bcrypt.hash(patient.password, 10);
      const [userResult] = await pool.execute('INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, 1)', [patient.name, patient.email, hashedPassword, 'patient']);
      await pool.execute('INSERT INTO patients (user_id, age, gender, phone, address, blood_group) VALUES (?, ?, ?, ?, ?, ?)', [userResult.insertId, patient.age, patient.gender, patient.phone, patient.address, patient.blood_group]);
    }
    console.log('✅ Patients inserted');

    const [doctorsResult] = await pool.execute('SELECT id FROM doctors LIMIT 3');
    const [patientsResult] = await pool.execute('SELECT id FROM patients LIMIT 3');
    const [departmentsResult] = await pool.execute('SELECT id FROM departments LIMIT 3');

    const appointments = [
      { patient_id: patientsResult[0].id, doctor_id: doctorsResult[0].id, department_id: departmentsResult[0].id, date: '2024-12-20', time: '10:00:00', status: 'approved', description: 'Regular checkup for heart condition' },
      { patient_id: patientsResult[1].id, doctor_id: doctorsResult[1].id, department_id: departmentsResult[1].id, date: '2024-12-21', time: '14:30:00', status: 'pending', description: 'Neurological consultation for headaches' },
      { patient_id: patientsResult[2].id, doctor_id: doctorsResult[2].id, department_id: departmentsResult[2].id, date: '2024-12-22', time: '09:00:00', status: 'completed', description: 'Follow-up appointment for knee injury' }
    ];

    for (const appointment of appointments) {
      await pool.execute('INSERT INTO appointments (patient_id, doctor_id, department_id, date, time, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)', [appointment.patient_id, appointment.doctor_id, appointment.department_id, appointment.date, appointment.time, appointment.status, appointment.description]);
    }
    console.log('✅ Appointments inserted');

    const feedbacks = [
      { patient_id: patientsResult[0].id, message: 'Excellent care and professional staff. Highly recommended!', rating: 5 },
      { patient_id: patientsResult[1].id, message: 'Very knowledgeable doctor and clean facility.', rating: 4 },
      { patient_id: patientsResult[2].id, message: 'Great experience with the orthopedic department.', rating: 5 }
    ];

    for (const feedback of feedbacks) {
      await pool.execute('INSERT INTO feedbacks (patient_id, message, rating) VALUES (?, ?, ?)', [feedback.patient_id, feedback.message, feedback.rating]);
    }
    console.log('✅ Feedback inserted');

    const galleryItems = [
      { title: 'Modern Hospital Reception', image_path: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit' },
      { title: 'Advanced Operating Theater', image_path: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop' },
      { title: 'Emergency Department', image_path: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop' },
      { title: 'Patient Room', image_path: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop' },
      { title: 'Medical Laboratory', image_path: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop' },
      { title: 'Radiology Department', image_path: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop' },
      { title: 'Pediatric Ward', image_path: 'https://images.unsplash.com/photo-1576765608535-5f04d336d7e2?w=400&h=300&fit=crop' },
      { title: 'Hospital Exterior', image_path: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&h=300&fit=crop' }
    ];

    for (const item of galleryItems) {
      await pool.execute('INSERT INTO gallery (title, image_path) VALUES (?, ?)', [item.title, item.image_path]);
    }
    console.log('✅ Gallery items inserted');

    console.log('\n🎉 Sample data insertion completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('👑 Admin: admin@hospital.com / admin123');
    console.log('👨‍⚕️ Doctor: dr.smith@hospital.com / doctor123');
    console.log('👥 Staff: staff@hospital.com / staff123');
    console.log('👤 Patient: patient1@email.com / patient123');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    process.exit();
  }
};

insertSampleData();
