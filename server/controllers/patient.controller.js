const Joi = require('joi');
const sequelize = require('../config/database');
const { generateUID } = require('../services/uid.service');
const { writeAudit } = require('../services/audit.service');

const patientSchema = Joi.object({
  isEmployee: Joi.boolean().default(false),
  employeeId: Joi.string().max(50).allow('', null).optional(),
  photoUrl: Joi.string().uri().allow('', null).optional(),
  salutationId: Joi.number().integer().optional().allow(null),
  firstName: Joi.string().max(50).required(),
  middleName: Joi.string().max(50).allow('', null).optional(),
  lastName: Joi.string().max(50).required(),
  gender: Joi.string().valid('Male', 'Female', 'Trans', 'Others').required(),
  dob: Joi.date().iso().max('now').allow(null).optional(),
  ageYears: Joi.number().integer().min(0).max(150).default(0),
  ageMonths: Joi.number().integer().min(0).max(11).default(0),
  ageDays: Joi.number().integer().min(0).max(31).default(0),
  mobile: Joi.string().pattern(/^\d{10}$/).required(),
  alternateMobile: Joi.string().pattern(/^\d{10}$/).allow('', null).optional(),
  pincode: Joi.string().pattern(/^\d{6}$/).required(),
  area: Joi.string().max(150).allow('', null).optional(),
  city: Joi.string().max(150).required(),
  district: Joi.string().max(150).required(),
  state: Joi.string().max(150).required(),
  currentAddress: Joi.string().max(500).required(),
  permanentAddress: Joi.string().max(500).required(),
  sameAddress: Joi.boolean().default(false),
  patientTypeId: Joi.number().integer().required(),
  referredById: Joi.number().integer().required(),
  consultantId: Joi.number().integer().allow(null).optional(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').allow(null, '').optional(),
  maritalStatusId: Joi.number().integer().allow(null).optional(),
  isMlc: Joi.boolean().default(false),
  mlcAccompaniedBy: Joi.string().max(100).allow('', null).optional(),
  mlcAccompaniedPhone: Joi.string().max(15).allow('', null).optional(),
  mlcPoliceBatchNo: Joi.string().max(150).allow('', null).optional(),
  mlcIncidentSpot: Joi.string().max(150).allow('', null).optional(),
  mlcRemarks: Joi.string().max(150).allow('', null).optional(),
  mlcDocumentUrl: Joi.string().uri().allow('', null).optional(),
  identities: Joi.array().items(Joi.object({
    identityTypeId: Joi.number().integer().required(),
    identityNumber: Joi.string().max(150).required(),
  })).optional().default([]),
  relations: Joi.array().items(Joi.object({
    relationTypeId: Joi.number().integer().required(),
    name: Joi.string().max(150).required(),
    phone: Joi.string().max(15).allow('', null).optional(),
    address: Joi.string().max(500).allow('', null).optional(),
  })).optional().default([]),
});

async function createPatient(req, res) {
  const { error, value } = patientSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.details.map((d) => d.message) });
  }

  const { orgId, centerId, orgCode, id: userId } = req.session.user;
  const ip = req.ip;
  const ua = req.headers['user-agent'];

  const t = await sequelize.transaction();
  try {
    const uid = await generateUID(orgId, orgCode);

    const [patientRows] = await sequelize.query(
      `INSERT INTO patients (
        uid, org_id, center_id, is_employee, employee_id, photo_url,
        salutation_id, first_name, middle_name, last_name,
        gender, dob, age_years, age_months, age_days,
        mobile, alternate_mobile, pincode, area, city, district, state,
        current_address, permanent_address, same_address,
        patient_type_id, referred_by_id, consultant_id,
        blood_group, marital_status_id,
        is_mlc, mlc_accompanied_by, mlc_accompanied_phone, mlc_police_batch_no,
        mlc_incident_spot, mlc_remarks, mlc_document_url,
        created_by, created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,
        $29,$30,$31,$32,$33,$34,$35,$36,$37,$38,NOW(),NOW()
      ) RETURNING id`,
      {
        bind: [
          uid, orgId, centerId,
          value.isEmployee || false, value.employeeId || null, value.photoUrl || null,
          value.salutationId || null, value.firstName, value.middleName || null, value.lastName,
          value.gender, value.dob || null, value.ageYears, value.ageMonths, value.ageDays,
          value.mobile, value.alternateMobile || null,
          value.pincode, value.area || null, value.city, value.district, value.state,
          value.currentAddress, value.permanentAddress, value.sameAddress || false,
          value.patientTypeId, value.referredById, value.consultantId || null,
          value.bloodGroup || null, value.maritalStatusId || null,
          value.isMlc || false,
          value.mlcAccompaniedBy || null, value.mlcAccompaniedPhone || null,
          value.mlcPoliceBatchNo || null, value.mlcIncidentSpot || null,
          value.mlcRemarks || null, value.mlcDocumentUrl || null,
          userId,
        ],
        transaction: t,
      },
    );

    const patientId = patientRows[0].id;

    // Insert identities
    for (const id of (value.identities || [])) {
      await sequelize.query(
        `INSERT INTO patient_identities (patient_id, identity_type_id, identity_number) VALUES ($1,$2,$3)`,
        { bind: [patientId, id.identityTypeId, id.identityNumber], transaction: t },
      );
    }

    // Insert relations
    for (const rel of (value.relations || [])) {
      await sequelize.query(
        `INSERT INTO patient_relations (patient_id, relation_type_id, name, phone, address) VALUES ($1,$2,$3,$4,$5)`,
        { bind: [patientId, rel.relationTypeId, rel.name, rel.phone || null, rel.address || null], transaction: t },
      );
    }

    await t.commit();

    // Async audit
    writeAudit({ orgId, tableName: 'patients', recordId: patientId, action: 'CREATE', performedBy: userId, newValues: { uid, ...value }, ip, userAgent: ua });

    const warnings = [];
    if (value.isMlc && !value.mlcDocumentUrl) {
      warnings.push('MLC document not uploaded — please upload within 24 hours');
    }

    // Daily token = position of this patient in today's queue for this consultant
    let dailyToken = null;
    if (value.consultantId) {
      const [tokenRows] = await sequelize.query(
        `SELECT COUNT(*) AS token_no FROM patients
         WHERE consultant_id = $1
           AND org_id = $2
           AND DATE(created_at) = CURRENT_DATE
           AND is_deleted = false`,
        { bind: [value.consultantId, orgId] },
      );
      dailyToken = parseInt(tokenRows[0].token_no, 10) || null;
    }

    return res.status(201).json({ uid, patientId, dailyToken, warnings });
  } catch (err) {
    await t.rollback();
    console.error('Create patient error:', err);
    return res.status(500).json({ error: 'Failed to register patient' });
  }
}

async function getPatient(req, res) {
  const { uid } = req.params;
  const { orgId } = req.session.user;

  const [rows] = await sequelize.query(
    `SELECT p.*,
       s.value AS salutation, pt.value AS patient_type,
       rb.name AS referred_by, c.name AS consultant,
       ms.value AS marital_status,
       u.full_name AS registered_by
     FROM patients p
     LEFT JOIN salutation_master s ON s.id = p.salutation_id
     LEFT JOIN patient_type_master pt ON pt.id = p.patient_type_id
     LEFT JOIN referred_by_master rb ON rb.id = p.referred_by_id
     LEFT JOIN consultant_master c ON c.id = p.consultant_id
     LEFT JOIN marital_status_master ms ON ms.id = p.marital_status_id
     LEFT JOIN users u ON u.id = p.created_by
     WHERE p.uid=$1 AND p.org_id=$2`,
    { bind: [uid, orgId] },
  );

  if (!rows.length) return res.status(404).json({ error: 'Patient not found' });

  const patient = rows[0];
  if (patient.is_deleted && req.session.user.role === 'receptionist') {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Get identities and relations
  const [identities] = await sequelize.query(
    `SELECT pi.identity_number, it.value AS identity_type
     FROM patient_identities pi
     JOIN identity_type_master it ON it.id = pi.identity_type_id
     WHERE pi.patient_id=$1`,
    { bind: [patient.id] },
  );
  const [relations] = await sequelize.query(
    `SELECT pr.name, pr.phone, pr.address, rt.value AS relation_type
     FROM patient_relations pr
     JOIN relation_type_master rt ON rt.id = pr.relation_type_id
     WHERE pr.patient_id=$1`,
    { bind: [patient.id] },
  );

  return res.json({ ...patient, identities, relations });
}

async function searchPatients(req, res) {
  const { q, page = 1 } = req.query;
  const { orgId } = req.session.user;
  const limit = 20;
  const offset = (page - 1) * limit;

  let whereClause = 'p.org_id=$1';
  const bind = [orgId];

  if (q) {
    bind.push(`%${q}%`);
    whereClause += ` AND (p.uid ILIKE $${bind.length} OR p.first_name ILIKE $${bind.length} OR p.last_name ILIKE $${bind.length} OR p.mobile ILIKE $${bind.length})`;
  }

  // By default, hide deleted patients (admin can toggle with showDeleted=true)
  if (req.query.showDeleted !== 'true') {
    whereClause += ' AND p.is_deleted=false';
  }

  const [rows] = await sequelize.query(
    `SELECT p.id, p.uid, p.first_name, p.last_name, p.gender, p.dob, p.age_years,
            p.mobile, p.is_mlc, p.is_deleted, p.created_at, u.full_name AS registered_by,
            pt.value AS patient_type
     FROM patients p
     LEFT JOIN users u ON u.id = p.created_by
     LEFT JOIN patient_type_master pt ON pt.id = p.patient_type_id
     WHERE ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT $${bind.length + 1} OFFSET $${bind.length + 2}`,
    { bind: [...bind, limit, offset] },
  );

  const [countRows] = await sequelize.query(
    `SELECT COUNT(*) as total FROM patients p WHERE ${whereClause}`,
    { bind },
  );

  return res.json({ patients: rows, total: parseInt(countRows[0].total), page: parseInt(page), limit });
}

async function updatePatient(req, res) {
  const { id } = req.params;
  const { orgId, id: userId } = req.session.user;
  const ip = req.ip;
  const ua = req.headers['user-agent'];

  const [existing] = await sequelize.query(
    `SELECT * FROM patients WHERE id=$1 AND org_id=$2 AND is_deleted=false`,
    { bind: [id, orgId] },
  );
  if (!existing.length) return res.status(404).json({ error: 'Patient not found' });

  const old = existing[0];
  const allowed = ['first_name', 'middle_name', 'last_name', 'gender', 'dob', 'age_years', 'age_months', 'age_days',
    'mobile', 'alternate_mobile', 'pincode', 'area', 'city', 'district', 'state',
    'current_address', 'permanent_address', 'patient_type_id', 'referred_by_id', 'consultant_id',
    'blood_group', 'marital_status_id', 'photo_url'];

  const updates = {};
  for (const key of allowed) {
    const camel = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    if (req.body[camel] !== undefined) updates[key] = req.body[camel];
    else if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) return res.status(400).json({ error: 'No valid fields to update' });

  const setClauses = Object.keys(updates).map((k, i) => `${k}=$${i + 3}`).join(', ');
  await sequelize.query(
    `UPDATE patients SET ${setClauses}, updated_at=NOW() WHERE id=$1 AND org_id=$2`,
    { bind: [id, orgId, ...Object.values(updates)] },
  );

  writeAudit({ orgId, tableName: 'patients', recordId: parseInt(id), action: 'UPDATE', performedBy: userId, oldValues: old, newValues: updates, ip, userAgent: ua });

  return res.json({ message: 'Patient updated' });
}

async function deletePatient(req, res) {
  const { id } = req.params;
  const { orgId, id: userId } = req.session.user;
  const ip = req.ip;
  const ua = req.headers['user-agent'];

  const [rows] = await sequelize.query(
    `UPDATE patients SET is_deleted=true, deleted_by=$1, deleted_at=NOW(), updated_at=NOW()
     WHERE id=$2 AND org_id=$3 AND is_deleted=false RETURNING id, uid`,
    { bind: [userId, id, orgId] },
  );

  if (!rows.length) return res.status(404).json({ error: 'Patient not found or already deleted' });

  writeAudit({ orgId, tableName: 'patients', recordId: parseInt(id), action: 'DELETE', performedBy: userId, newValues: { is_deleted: true }, ip, userAgent: ua });

  return res.json({ message: 'Patient deleted (soft delete)' });
}

async function restorePatient(req, res) {
  const { id } = req.params;
  const { orgId, id: userId } = req.session.user;
  const ip = req.ip;
  const ua = req.headers['user-agent'];

  const [rows] = await sequelize.query(
    `UPDATE patients SET is_deleted=false, deleted_by=NULL, deleted_at=NULL, updated_at=NOW()
     WHERE id=$1 AND org_id=$2 AND is_deleted=true RETURNING id`,
    { bind: [id, orgId] },
  );

  if (!rows.length) return res.status(404).json({ error: 'Patient not found or not deleted' });

  writeAudit({ orgId, tableName: 'patients', recordId: parseInt(id), action: 'RESTORE', performedBy: userId, newValues: { is_deleted: false }, ip, userAgent: ua });

  return res.json({ message: 'Patient restored' });
}

module.exports = { createPatient, getPatient, searchPatients, updatePatient, deletePatient, restorePatient };
