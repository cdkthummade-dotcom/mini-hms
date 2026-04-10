import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { formatDate, formatDateTime } from '../../utils/ageCalculator';
import { useAuth } from '../../context/AuthContext';

/* Extract token number from UID (e.g. DH2026000042 → 42) */
function tokenFromUid(uid) {
  if (!uid) return '—';
  const match = uid.match(/(\d+)$/);
  return match ? String(parseInt(match[1], 10)) : uid;
}

export default function PrintReceipt({ uid, patient }) {
  const barcodeRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!uid || !barcodeRef.current) return;
    import('jsbarcode').then(({ default: JsBarcode }) => {
      JsBarcode(barcodeRef.current, uid, {
        format: 'CODE128',
        width: 1.8,
        height: 50,
        displayValue: true,
        fontSize: 11,
      });
    });
  }, [uid]);

  const now = new Date().toISOString();
  const token = tokenFromUid(uid);

  const receipt = createPortal(
    <div className="print-receipt">
      <style>{`
        .print-receipt { display: none; }

        @media print {
          @page { size: A4; margin: 12mm 15mm; }
          body > * { display: none !important; }
          .print-receipt {
            display: block !important;
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            width: 100%;
          }

          /* ---------- layout helpers ---------- */
          .pr-flex   { display: flex; }
          .pr-between{ display: flex; justify-content: space-between; align-items: flex-start; }
          .pr-center { text-align: center; }
          .pr-right  { text-align: right; }
          .pr-bold   { font-weight: bold; }
          .pr-hr     { border: none; border-top: 1px solid #000; margin: 6px 0; }
          .pr-hr2    { border: none; border-top: 2px solid #000; margin: 6px 0; }

          /* ---------- header ---------- */
          .pr-hospital-name {
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 1px;
            margin: 0 0 2px;
          }
          .pr-hospital-sub { font-size: 10px; margin: 1px 0; color: #222; }
          .pr-doc-title {
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 2px;
            text-decoration: underline;
            margin: 6px 0 0;
          }

          /* ---------- patient info grid ---------- */
          .pr-info-row {
            display: flex;
            padding: 3px 0;
          }
          .pr-info-label {
            font-weight: bold;
            width: 130px;
            flex-shrink: 0;
            font-size: 10px;
            text-transform: uppercase;
          }
          .pr-info-colon { width: 14px; flex-shrink: 0; }
          .pr-info-value { flex: 1; font-size: 11px; }

          /* ---------- two-column section ---------- */
          .pr-two-col { display: flex; gap: 12px; }
          .pr-col-left { flex: 1; }
          .pr-col-right { width: 180px; flex-shrink: 0; text-align: center; }

          /* ---------- consultant band ---------- */
          .pr-consultant-band {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f0f0f0;
            border: 1px solid #bbb;
            padding: 6px 10px;
            margin: 8px 0;
          }
          .pr-consultant-name { font-size: 13px; font-weight: bold; }
          .pr-consultant-dept { font-size: 10px; color: #333; margin-top: 2px; }
          .pr-token-box { text-align: right; }
          .pr-token-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
          .pr-token-num { font-size: 28px; font-weight: bold; font-family: monospace; line-height: 1; }

          /* ---------- validity ---------- */
          .pr-validity {
            border: 1px solid #999;
            padding: 4px 8px;
            font-size: 10px;
            margin: 6px 0;
          }

          /* ---------- mlc ---------- */
          .pr-mlc {
            border: 2px solid red;
            padding: 6px;
            text-align: center;
            color: red;
            font-weight: bold;
            font-size: 13px;
            margin: 8px 0;
            letter-spacing: 2px;
          }

          /* ---------- notes area ---------- */
          .pr-notes-area {
            border: 1px solid #bbb;
            height: 100px;
            margin: 8px 0;
            padding: 6px;
            font-size: 10px;
            color: #aaa;
          }

          /* ---------- footer ---------- */
          .pr-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 10px;
          }
          .pr-sig-line {
            border-top: 1px solid #000;
            margin-top: 30px;
            padding-top: 2px;
            font-size: 9px;
            text-align: center;
          }
          .pr-footer-note {
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 5px;
            text-align: center;
            font-size: 9px;
            color: #666;
          }
        }
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <div className="pr-center" style={{ paddingBottom: '8px' }}>
        <p className="pr-hospital-name">DEMO HOSPITAL</p>
        <p className="pr-hospital-sub">Main Center, Hyderabad, Telangana — 500 001</p>
        <p className="pr-hospital-sub">Ph: 040-1234-5678 &nbsp;|&nbsp; Emergency: 040-1234-5679</p>
        <p className="pr-doc-title">OUT PATIENT REGISTRATION RECEIPT</p>
      </div>
      <hr className="pr-hr2" />

      {/* ══════════ BILL META ROW ══════════ */}
      <div className="pr-between" style={{ padding: '2px 0 4px' }}>
        <span><span className="pr-bold">Bill No</span> : {uid}</span>
        <span><span className="pr-bold">Date &amp; Time</span> : {formatDateTime(now)}</span>
      </div>
      <hr className="pr-hr" />

      {/* ══════════ PATIENT INFO + BARCODE ══════════ */}
      <div className="pr-two-col" style={{ marginTop: '6px' }}>

        {/* Left column — patient fields */}
        <div className="pr-col-left">
          <div className="pr-info-row">
            <span className="pr-info-label">Patient Name</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value pr-bold" style={{ fontSize: '13px' }}>
              {patient?.salutation} {patient?.firstName} {patient?.middleName} {patient?.lastName}
            </span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Registration No</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value pr-bold" style={{ fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>{uid}</span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Age / DOB</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">
              {patient?.ageYears} Yrs {patient?.ageMonths} Mo &nbsp;/&nbsp; {formatDate(patient?.dob) || 'Not provided'}
            </span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Gender</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">{patient?.gender}</span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Mobile</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">+91 {patient?.mobile}</span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Patient Type</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">{patient?.patientTypeName}</span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Referred By</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">{patient?.referredByName || '—'}</span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Reg. Date</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">{formatDateTime(now)}</span>
          </div>
        </div>

        {/* Right column — barcode */}
        <div className="pr-col-right" style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
          <p style={{ fontSize: '9px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555' }}>Scan to Verify</p>
          <svg ref={barcodeRef} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
          <p style={{ fontSize: '9px', marginTop: '4px', color: '#555' }}>
            {uid}
          </p>
        </div>
      </div>

      <hr className="pr-hr" style={{ marginTop: '8px' }} />

      {/* ══════════ CONSULTANT BAND ══════════ */}
      <div className="pr-consultant-band">
        <div>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px', color: '#555' }}>Primary Consultant</p>
          <p className="pr-consultant-name">{patient?.consultantName || '— Not Assigned —'}</p>
          {patient?.consultantDept && <p className="pr-consultant-dept">{patient.consultantDept}</p>}
        </div>
        <div className="pr-token-box">
          <p className="pr-token-label">Token No.</p>
          <p className="pr-token-num">{token}</p>
        </div>
      </div>

      {/* ══════════ VALIDITY ══════════ */}
      <div className="pr-validity">
        <span className="pr-bold">Note:</span> This receipt is valid for <span className="pr-bold">one free review visit within 15 days</span> from the date of registration.
        Please carry this receipt for your next visit.
      </div>

      {/* ══════════ MLC MARKER (conditional) ══════════ */}
      {patient?.isMlc && (
        <div className="pr-mlc">⚠ MEDICO-LEGAL CASE (MLC) ⚠</div>
      )}

      {/* ══════════ CLINICAL NOTES AREA ══════════ */}
      <div className="pr-notes-area">
        Doctor's Notes / Chief Complaints:
      </div>

      <hr className="pr-hr" />

      {/* ══════════ FOOTER ══════════ */}
      <div className="pr-footer">
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>
            <span className="pr-bold">Registered By</span> : {user?.fullName}
          </p>
          <p style={{ margin: '2px 0 0' }}>
            <span className="pr-bold">On</span> : {formatDateTime(now)}
          </p>
          <p style={{ margin: '2px 0 0' }}>
            <span className="pr-bold">Next Review On</span> : ___________________________
          </p>
          <div className="pr-sig-line" style={{ marginTop: '24px', width: '160px' }}>
            Authorized Signatory<br />For Demo Hospital
          </div>
        </div>

        <div style={{ textAlign: 'right', flex: 1 }}>
          <p style={{ margin: 0, fontSize: '10px', color: '#555' }}>For Appointments Call</p>
          <p style={{ margin: '2px 0 6px', fontWeight: 'bold', fontSize: '12px' }}>040-1234-5678</p>
          <div className="pr-sig-line" style={{ marginTop: '24px', display: 'inline-block', width: '160px' }}>
            DR. SIGNATURE
          </div>
        </div>
      </div>

      {/* ══════════ BOTTOM STRIP ══════════ */}
      <div className="pr-footer-note">
        This is a computer-generated receipt. No manual signature required for validity. &nbsp;|&nbsp;
        Demo Hospital, Main Center, Hyderabad — 040-1234-5678
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <button
        onClick={() => window.print()}
        className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
      >
        Print OPD Receipt
      </button>
      {receipt}
    </>
  );
}
