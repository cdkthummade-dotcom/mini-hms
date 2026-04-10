const sequelize = require('../config/database');
const { lookupPincode } = require('../services/pincode.service');

async function getEmployee(req, res) {
  const { empId } = req.params;
  const { orgId } = req.session.user;

  const [rows] = await sequelize.query(
    `SELECT employee_id, first_name, middle_name, last_name, salutation, gender, dob,
            mobile, email, designation, band, location_dept,
            pincode, area, city, district, state, current_address, permanent_address
     FROM employees WHERE employee_id=$1 AND org_id=$2 AND is_active=true LIMIT 1`,
    { bind: [empId, orgId] },
  );

  if (!rows.length) return res.status(404).json({ error: 'Employee not found' });

  const emp = rows[0];
  return res.json({
    employeeId: emp.employee_id,
    salutation: emp.salutation,
    firstName: emp.first_name,
    middleName: emp.middle_name,
    lastName: emp.last_name,
    gender: emp.gender,
    dob: emp.dob,
    mobile: emp.mobile,
    email: emp.email,
    designation: emp.designation,
    band: emp.band,
    locationDept: emp.location_dept,
    pincode: emp.pincode,
    area: emp.area,
    city: emp.city,
    district: emp.district,
    state: emp.state,
    currentAddress: emp.current_address,
    permanentAddress: emp.permanent_address,
  });
}

async function getPincode(req, res) {
  const { code } = req.params;
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid pincode format' });
  }

  try {
    const result = await lookupPincode(code);
    if (!result) return res.status(404).json({ error: 'Pincode not found' });
    return res.json(result);
  } catch (err) {
    console.error('Pincode lookup error:', err.message);
    return res.status(503).json({ error: 'Pincode service unavailable — please fill manually' });
  }
}

module.exports = { getEmployee, getPincode };
