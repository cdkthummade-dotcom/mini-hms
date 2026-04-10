require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

async function seed() {
  const [org] = await sequelize.query(
    `INSERT INTO organizations (name, code, timezone) VALUES ('Demo Hospital', 'DH', 'Asia/Kolkata')
     ON CONFLICT DO NOTHING RETURNING id`,
  );
  let orgId = org[0]?.id;
  if (!orgId) {
    const [existing] = await sequelize.query(`SELECT id FROM organizations WHERE code='DH' LIMIT 1`);
    orgId = existing[0].id;
  }
  console.log('Org ID:', orgId);

  const [center] = await sequelize.query(
    `INSERT INTO centers (org_id, name, address) VALUES ($1, 'Main Center', 'Demo Hospital, Hyderabad, Telangana')
     ON CONFLICT DO NOTHING RETURNING id`,
    { bind: [orgId] },
  );
  let centerId = center[0]?.id;
  if (!centerId) {
    const [existing] = await sequelize.query(`SELECT id FROM centers WHERE org_id=$1 LIMIT 1`, { bind: [orgId] });
    centerId = existing[0].id;
  }
  console.log('Center ID:', centerId);

  // Users
  const passwordRec = await bcrypt.hash('Demo@1234', 12);
  const passwordAdmin = await bcrypt.hash('Admin@1234', 12);
  const passwordSuper = await bcrypt.hash('SuperAdmin@1234', 12);

  const users = [
    { username: 'receptionist1', password_hash: passwordRec, full_name: 'Asha Reddy', role: 'receptionist' },
    { username: 'receptionist2', password_hash: passwordRec, full_name: 'Lakshmi Nair', role: 'receptionist' },
    { username: 'admin', password_hash: passwordAdmin, full_name: 'Admin User', role: 'admin' },
    { username: 'superadmin', password_hash: passwordSuper, full_name: 'Super Admin', role: 'superadmin' },
  ];
  for (const u of users) {
    await sequelize.query(
      `INSERT INTO users (org_id, center_id, username, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (username) DO NOTHING`,
      { bind: [orgId, centerId, u.username, u.password_hash, u.full_name, u.role] },
    );
  }
  console.log('Users seeded');

  // Salutations
  const salutations = ['Mr', 'Mrs', 'Ms', 'Dr', 'Baby', 'Master'];
  for (let i = 0; i < salutations.length; i++) {
    await sequelize.query(
      `INSERT INTO salutation_master (org_id, value, display_order) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      { bind: [orgId, salutations[i], i + 1] },
    );
  }

  // Patient types
  for (const pt of ['VIP', 'Regular', 'Staff', 'Corporate']) {
    await sequelize.query(
      `INSERT INTO patient_type_master (org_id, value) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      { bind: [orgId, pt] },
    );
  }

  // Referred by
  const refs = [
    { name: 'Dr. Ravi Kumar', type: 'doctor' },
    { name: 'Dr. Priya Sharma', type: 'doctor' },
    { name: 'City Health Camp', type: 'camp' },
    { name: 'Apollo Clinic', type: 'clinic' },
  ];
  for (const r of refs) {
    await sequelize.query(
      `INSERT INTO referred_by_master (org_id, name, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      { bind: [orgId, r.name, r.type] },
    );
  }

  // Consultants
  const consultants = [
    { name: 'Dr. Suresh Babu', specialisation: 'Cardiologist', department: 'Cardiology' },
    { name: 'Dr. Meena Iyer', specialisation: 'Orthopaedic Surgeon', department: 'Orthopaedics' },
    { name: 'Dr. Rajesh Verma', specialisation: 'General Physician', department: 'General Medicine' },
    { name: 'Dr. Kavitha Rao', specialisation: 'Neurologist', department: 'Neurology' },
    { name: 'Dr. Anitha Pillai', specialisation: 'Gynaecologist', department: 'Gynaecology' },
    { name: 'Dr. Venkat Reddy', specialisation: 'Pulmonologist', department: 'Pulmonology' },
    { name: 'Dr. Sanjay Gupta', specialisation: 'Gastroenterologist', department: 'Gastroenterology' },
    { name: 'Dr. Neerja Singh', specialisation: 'Paediatrician', department: 'Paediatrics' },
    { name: 'Dr. Mohan Das', specialisation: 'Dermatologist', department: 'Dermatology' },
    { name: 'Dr. Lakshmi Prasad', specialisation: 'Diabetologist', department: 'Endocrinology' },
  ];
  for (const c of consultants) {
    await sequelize.query(
      `INSERT INTO consultant_master (org_id, center_id, name, specialisation, department)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
      { bind: [orgId, centerId, c.name, c.specialisation, c.department] },
    );
  }

  // Identity types
  for (const it of ['Aadhar', 'PAN', 'Passport', 'Voter ID', 'Driving Licence']) {
    await sequelize.query(
      `INSERT INTO identity_type_master (org_id, value) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      { bind: [orgId, it] },
    );
  }

  // Relation types
  for (const rt of ['Father', 'Mother', 'Spouse', 'Sibling', 'Guardian', 'Friend']) {
    await sequelize.query(
      `INSERT INTO relation_type_master (org_id, value) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      { bind: [orgId, rt] },
    );
  }

  // Marital status
  for (const ms of ['Married', 'Unmarried', 'Widow']) {
    await sequelize.query(
      `INSERT INTO marital_status_master (org_id, value) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      { bind: [orgId, ms] },
    );
  }
  console.log('Masters seeded');

  // Employees
  const employees = [
    { employee_id: 'EMP001', first_name: 'Ravi', last_name: 'Shankar', gender: 'Male', mobile: '9876543210', email: 'ravi.shankar@demo.com', designation: 'Senior Manager', band: 'B3', location_dept: 'Admin', pincode: '500001', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', current_address: '12, Park Lane, Hyderabad', permanent_address: '12, Park Lane, Hyderabad', dob: '1980-05-15' },
    { employee_id: 'EMP002', first_name: 'Priya', last_name: 'Mehta', gender: 'Female', mobile: '9876543211', email: 'priya.mehta@demo.com', designation: 'Nurse', band: 'B1', location_dept: 'Nursing', pincode: '500002', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', current_address: '45, Rose Street, Hyderabad', permanent_address: '45, Rose Street, Hyderabad', dob: '1992-08-20' },
    { employee_id: 'EMP003', first_name: 'Arjun', last_name: 'Reddy', gender: 'Male', mobile: '9876543212', email: 'arjun.reddy@demo.com', designation: 'Lab Technician', band: 'B2', location_dept: 'Pathology', pincode: '500003', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', current_address: '78, MG Road, Hyderabad', permanent_address: '78, MG Road, Hyderabad', dob: '1988-03-10' },
    { employee_id: 'EMP004', first_name: 'Sneha', last_name: 'Gupta', gender: 'Female', mobile: '9876543213', email: 'sneha.gupta@demo.com', designation: 'Pharmacist', band: 'B2', location_dept: 'Pharmacy', pincode: '500004', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', current_address: '33, Lake View, Hyderabad', permanent_address: '33, Lake View, Hyderabad', dob: '1990-11-25' },
    { employee_id: 'EMP005', first_name: 'Vikram', last_name: 'Singh', gender: 'Male', mobile: '9876543214', email: 'vikram.singh@demo.com', designation: 'Security', band: 'B1', location_dept: 'Operations', pincode: '500005', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', current_address: '99, Old City, Hyderabad', permanent_address: '99, Old City, Hyderabad', dob: '1985-07-07' },
  ];
  for (const emp of employees) {
    await sequelize.query(
      `INSERT INTO employees (org_id, employee_id, first_name, last_name, gender, mobile, email, designation, band, location_dept, pincode, city, district, state, current_address, permanent_address, dob)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (employee_id) DO NOTHING`,
      { bind: [orgId, emp.employee_id, emp.first_name, emp.last_name, emp.gender, emp.mobile, emp.email, emp.designation, emp.band, emp.location_dept, emp.pincode, emp.city, emp.district, emp.state, emp.current_address, emp.permanent_address, emp.dob] },
    );
  }
  console.log('Employees seeded');

  // Get lookup IDs for patients
  const [[pt_vip], [pt_reg], [pt_staff], [pt_corp]] = await Promise.all([
    sequelize.query(`SELECT id FROM patient_type_master WHERE value='VIP' AND org_id=$1 LIMIT 1`, { bind: [orgId] }),
    sequelize.query(`SELECT id FROM patient_type_master WHERE value='Regular' AND org_id=$1 LIMIT 1`, { bind: [orgId] }),
    sequelize.query(`SELECT id FROM patient_type_master WHERE value='Staff' AND org_id=$1 LIMIT 1`, { bind: [orgId] }),
    sequelize.query(`SELECT id FROM patient_type_master WHERE value='Corporate' AND org_id=$1 LIMIT 1`, { bind: [orgId] }),
  ]);
  const [refRows] = await sequelize.query(`SELECT id FROM referred_by_master WHERE org_id=$1 AND is_active=true`, { bind: [orgId] });
  const [consultRows] = await sequelize.query(`SELECT id FROM consultant_master WHERE org_id=$1 AND is_active=true`, { bind: [orgId] });
  const [userRows] = await sequelize.query(`SELECT id FROM users WHERE org_id=$1 AND role='receptionist' LIMIT 1`, { bind: [orgId] });
  const recepId = userRows[0].id;

  const ptypeIds = { VIP: pt_vip[0]?.id, Regular: pt_reg[0]?.id, Staff: pt_staff[0]?.id, Corporate: pt_corp[0]?.id };
  const refId = refRows[0]?.id;
  const consultId = consultRows[0]?.id;

  // Seed 30 demo patients
  const names = [
    ['Mr', 'Amit', 'Kumar', 'Male', '1985-03-12', '9800000001', 'Regular', false, false],
    ['Mrs', 'Sunita', 'Sharma', 'Female', '1978-07-22', '9800000002', 'Regular', false, false],
    ['Dr', 'Rajan', 'Mehta', 'Male', '1960-01-05', '9800000003', 'VIP', false, false],
    ['Ms', 'Pooja', 'Singh', 'Female', '1995-11-30', '9800000004', 'Regular', false, false],
    ['Mr', 'Sanjay', 'Rao', 'Male', '1970-08-18', '9800000005', 'Corporate', false, false],
    ['Mrs', 'Rani', 'Devi', 'Female', '1945-04-03', '9800000006', 'Regular', false, false],
    ['Master', 'Aryan', 'Patel', 'Male', '2015-06-15', '9800000007', 'Regular', false, false],
    ['Baby', 'Kavya', 'Nair', 'Female', '2023-09-01', '9800000008', 'Regular', false, false],
    ['Mr', 'Deepak', 'Joshi', 'Male', '1982-12-20', '9800000009', 'Corporate', false, false],
    ['Mrs', 'Geeta', 'Pillai', 'Female', '1967-05-10', '9800000010', 'VIP', false, false],
    ['Mr', 'Naresh', 'Verma', 'Male', '1990-02-28', '9800000011', 'Regular', false, false],
    ['Ms', 'Divya', 'Reddy', 'Female', '1988-09-14', '9800000012', 'Regular', false, false],
    ['Mr', 'Harish', 'Kumar', 'Male', '1955-07-07', '9800000013', 'Regular', false, false],
    ['Mrs', 'Sarita', 'Gupta', 'Female', '1972-03-25', '9800000014', 'Regular', false, false],
    ['Mr', 'Raju', 'Prasad', 'Male', '1998-11-11', '9800000015', 'Regular', false, false],
    ['Mrs', 'Anita', 'Roy', 'Female', '1983-06-30', '9800000016', 'Regular', false, false],
    ['Mr', 'Suresh', 'Patil', 'Male', '1975-01-19', '9800000017', 'Regular', false, false],
    ['Ms', 'Meenakshi', 'Iyer', 'Female', '1993-04-22', '9800000018', 'Regular', false, false],
    ['Mr', 'Vinod', 'Chandra', 'Male', '1980-10-08', '9800000019', 'Regular', false, false],
    ['Mrs', 'Radha', 'Krishnan', 'Female', '1962-08-14', '9800000020', 'Regular', false, false],
    // Employee patients (5)
    ['Mr', 'Ravi', 'Shankar', 'Male', '1980-05-15', '9876543210', 'Staff', true, false, 'EMP001'],
    ['Mrs', 'Priya', 'Mehta', 'Female', '1992-08-20', '9876543211', 'Staff', true, false, 'EMP002'],
    ['Mr', 'Arjun', 'Reddy', 'Male', '1988-03-10', '9876543212', 'Staff', true, false, 'EMP003'],
    ['Mrs', 'Sneha', 'Gupta', 'Female', '1990-11-25', '9876543213', 'Staff', true, false, 'EMP004'],
    ['Mr', 'Vikram', 'Singh', 'Male', '1985-07-07', '9876543214', 'Staff', true, false, 'EMP005'],
    // MLC patients (3)
    ['Mr', 'Rahul', 'Tiwari', 'Male', '1991-03-20', '9800000026', 'Regular', false, true],
    ['Mrs', 'Seema', 'Bose', 'Female', '1974-09-11', '9800000027', 'Regular', false, true],
    ['Mr', 'Anil', 'Yadav', 'Male', '1968-12-05', '9800000028', 'Regular', false, true],
    // VIP patients (2 more)
    ['Mr', 'Rajendra', 'Shah', 'Male', '1950-02-14', '9800000029', 'VIP', false, false],
    ['Mrs', 'Kamala', 'Devi', 'Female', '1955-06-18', '9800000030', 'VIP', false, false],
  ];

  const year = new Date().getFullYear();
  for (let i = 0; i < names.length; i++) {
    const [sal, fn, ln, gender, dob, mobile, ptKey, isEmp, isMlc, empId] = names[i];
    const uid = `DH${year}${String(i + 1).padStart(6, '0')}`;
    const ptId = ptypeIds[ptKey] || ptypeIds.Regular;

    const mlcFields = isMlc ? {
      is_mlc: true,
      mlc_accompanied_by: 'Police Officer',
      mlc_police_batch_no: `PB${100 + i}`,
      mlc_incident_spot: 'Highway NH-44',
      mlc_remarks: 'Brought by police',
    } : { is_mlc: false };

    const dobDate = new Date(dob);
    const today = new Date();
    const ageYears = today.getFullYear() - dobDate.getFullYear() -
      ((today.getMonth() < dobDate.getMonth() || (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) ? 1 : 0);

    try {
      await sequelize.query(
        `INSERT INTO patients (uid, org_id, center_id, is_employee, employee_id, salutation_id, first_name, last_name, gender, dob, age_years, mobile, pincode, city, district, state, current_address, permanent_address, patient_type_id, referred_by_id, consultant_id, is_mlc, mlc_accompanied_by, mlc_police_batch_no, mlc_incident_spot, mlc_remarks, created_by)
         VALUES ($1,$2,$3,$4,$5,(SELECT id FROM salutation_master WHERE value=$6 AND org_id=$2 LIMIT 1),$7,$8,$9,$10,$11,$12,'500001','Hyderabad','Hyderabad','Telangana','Demo Address, Hyderabad','Demo Address, Hyderabad',$13,$14,$15,$16,$17,$18,$19,$20,$21)
         ON CONFLICT (uid) DO NOTHING`,
        {
          bind: [
            uid, orgId, centerId,
            isEmp || false, empId || null,
            sal, fn, ln, gender, dob, ageYears, mobile,
            ptId, refId, consultId,
            mlcFields.is_mlc || false,
            mlcFields.mlc_accompanied_by || null,
            mlcFields.mlc_police_batch_no || null,
            mlcFields.mlc_incident_spot || null,
            mlcFields.mlc_remarks || null,
            recepId,
          ],
        },
      );
    } catch (e) {
      console.warn(`Patient ${uid} skip:`, e.message);
    }
  }

  // Set UID sequence
  await sequelize.query(
    `INSERT INTO uid_sequences (org_id, year, last_serial) VALUES ($1, $2, 30)
     ON CONFLICT (org_id, year) DO UPDATE SET last_serial = GREATEST(uid_sequences.last_serial, 30)`,
    { bind: [orgId, year] },
  );

  console.log('30 demo patients seeded');
  console.log('\nSeed complete! Login credentials:');
  console.log('  receptionist1 / Demo@1234');
  console.log('  receptionist2 / Demo@1234');
  console.log('  admin         / Admin@1234');
  console.log('  superadmin    / SuperAdmin@1234');

  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
