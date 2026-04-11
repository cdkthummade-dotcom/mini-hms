import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { formatDate, formatDateTime } from '../../utils/ageCalculator';

/* Generate OPD bill number: OPD/DDMMYYYY/001 */
function buildBillNo(dailyToken) {
  const d = new Date();
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const seq  = dailyToken != null ? String(dailyToken).padStart(3, '0') : '???';
  return `OPD/${dd}${mm}${yyyy}/${seq}`;
}

export default function PrintReceipt({ uid, patient, dailyToken }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (!uid || !barcodeRef.current) return;
    import('jsbarcode').then(({ default: JsBarcode }) => {
      JsBarcode(barcodeRef.current, uid, {
        format: 'CODE128',
        width: 1.8,
        height: 45,
        displayValue: true,
        fontSize: 10,
      });
    });
  }, [uid]);

  const now    = new Date().toISOString();
  const token  = dailyToken != null ? String(dailyToken) : '—';
  const billNo = buildBillNo(dailyToken);

  const receipt = createPortal(
    <div className="print-receipt">
      <style>{`
        .print-receipt { display: none; }

        @media print {
          @page { size: A4; margin: 0; }
          body > * { display: none !important; }

          /* Full-page flex column so notes fills remaining space */
          .print-receipt {
            display: flex !important;
            flex-direction: column;
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            width: 100%;
            height: 297mm;
            padding: 10mm 14mm 8mm;
            box-sizing: border-box;
          }

          .pr-grow { flex: 1; display: flex; flex-direction: column; }

          /* ---------- helpers ---------- */
          .pr-between { display: flex; justify-content: space-between; align-items: flex-start; }
          .pr-center  { text-align: center; }
          .pr-bold    { font-weight: bold; }
          .pr-hr      { border: none; border-top: 1px solid #000; margin: 4px 0; flex-shrink: 0; }
          .pr-hr2     { border: none; border-top: 2px solid #000; margin: 4px 0; flex-shrink: 0; }

          /* ---------- header ---------- */
          .pr-hospital-name {
            font-size: 20px; font-weight: bold;
            letter-spacing: 1px; margin: 0 0 1px;
          }
          .pr-hospital-sub { font-size: 9px; margin: 1px 0; color: #222; }
          .pr-doc-title {
            font-size: 12px; font-weight: bold;
            letter-spacing: 2px; text-decoration: underline;
            margin: 4px 0 0;
          }

          /* ---------- patient info ---------- */
          .pr-info-row {
            display: flex;
            padding: 1px 0;
            line-height: 1.4;
          }
          .pr-info-label {
            font-weight: bold; width: 120px;
            flex-shrink: 0; font-size: 9px;
            text-transform: uppercase; color: #333;
          }
          .pr-info-colon { width: 12px; flex-shrink: 0; font-size: 9px; }
          .pr-info-value { flex: 1; font-size: 10px; }

          /* ---------- two-column ---------- */
          .pr-two-col   { display: flex; gap: 10px; }
          .pr-col-left  { flex: 1; }
          .pr-col-right { width: 160px; flex-shrink: 0; text-align: center; }

          /* ---------- consultant band ---------- */
          .pr-consultant-band {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f0f0f0;
            border: 1px solid #bbb;
            padding: 5px 10px;
            margin: 6px 0 4px;
            flex-shrink: 0;
          }
          .pr-consultant-name  { font-size: 13px; font-weight: bold; margin: 0; }
          .pr-token-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
          .pr-token-num   { font-size: 26px; font-weight: bold; font-family: monospace; line-height: 1; margin: 0; }

          /* ---------- validity ---------- */
          .pr-validity {
            border: 1px solid #999;
            padding: 3px 8px;
            font-size: 9px;
            margin: 0 0 4px;
            flex-shrink: 0;
          }

          /* ---------- mlc ---------- */
          .pr-mlc {
            border: 2px solid red;
            padding: 4px;
            text-align: center;
            color: red;
            font-weight: bold;
            font-size: 12px;
            margin: 4px 0;
            letter-spacing: 2px;
            flex-shrink: 0;
          }

          /* ---------- notes — fills all remaining space ---------- */
          .pr-notes-area {
            border: 1px solid #bbb;
            flex: 1;
            min-height: 120px;
            margin: 4px 0 6px;
            padding: 6px;
            font-size: 10px;
            color: #aaa;
          }

          /* ---------- bottom bar ---------- */
          .pr-bottom {
            flex-shrink: 0;
            border-top: 1px solid #ccc;
            padding-top: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9px;
            color: #444;
          }
        }
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <div className="pr-center" style={{ paddingBottom: '4px', flexShrink: 0 }}>
        <p className="pr-hospital-name">DEMO HOSPITAL</p>
        <p className="pr-hospital-sub">Main Center, Hyderabad, Telangana — 500 001</p>
        <p className="pr-hospital-sub">Ph: 040-1234-5678 &nbsp;|&nbsp; Emergency: 040-1234-5679</p>
        <p className="pr-doc-title">OUT PATIENT REGISTRATION RECEIPT</p>
      </div>
      <hr className="pr-hr2" />

      {/* ══════════ BILL NO ROW ══════════ */}
      <div className="pr-between" style={{ padding: '2px 0', flexShrink: 0 }}>
        <span><span className="pr-bold">Bill No</span> : {billNo}</span>
        <span><span className="pr-bold">Reg. Date</span> : {formatDateTime(now)}</span>
      </div>
      <hr className="pr-hr" />

      {/* ══════════ PATIENT INFO + BARCODE ══════════ */}
      <div className="pr-two-col" style={{ marginTop: '4px', flexShrink: 0 }}>

        {/* Left — patient fields (compact) */}
        <div className="pr-col-left">
          <div className="pr-info-row">
            <span className="pr-info-label">Patient Name</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value pr-bold" style={{ fontSize: '12px' }}>
              {patient?.salutation} {patient?.firstName} {patient?.middleName} {patient?.lastName}
            </span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Registration No</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value pr-bold" style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1px' }}>{uid}</span>
          </div>
          <div className="pr-info-row">
            <span className="pr-info-label">Age / DOB</span>
            <span className="pr-info-colon">:</span>
            <span className="pr-info-value">
              {patient?.ageYears} Yrs {patient?.ageMonths} Mo &nbsp;/&nbsp; {formatDate(patient?.dob) || '—'}
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
        </div>

        {/* Right — barcode */}
        <div className="pr-col-right" style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
          <p style={{ fontSize: '8px', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555' }}>Scan to Verify</p>
          <svg ref={barcodeRef} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
          <p style={{ fontSize: '8px', marginTop: '3px', color: '#555' }}>{uid}</p>
        </div>
      </div>

      <hr className="pr-hr" style={{ marginTop: '4px' }} />

      {/* ══════════ CONSULTANT BAND ══════════ */}
      <div className="pr-consultant-band">
        <div>
          <p style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1px', color: '#555' }}>Primary Consultant</p>
          <p className="pr-consultant-name">{patient?.consultantName || '— Not Assigned —'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="pr-token-label">Token No.</p>
          <p className="pr-token-num">{token}</p>
        </div>
      </div>

      {/* ══════════ VALIDITY ══════════ */}
      <div className="pr-validity">
        <span className="pr-bold">Note:</span> This receipt is valid for{' '}
        <span className="pr-bold">one free review visit within 15 days</span> from date of registration.
        Please carry this receipt for your next visit.
      </div>

      {/* ══════════ MLC MARKER ══════════ */}
      {patient?.isMlc && (
        <div className="pr-mlc">⚠ MEDICO-LEGAL CASE (MLC) ⚠</div>
      )}

      {/* ══════════ NOTES — fills rest of page ══════════ */}
      <div className="pr-notes-area pr-grow">
        Doctor's Notes / Chief Complaints:
      </div>

      {/* ══════════ BOTTOM BAR — phone only ══════════ */}
      <div className="pr-bottom">
        <span>Demo Hospital, Main Center, Hyderabad</span>
        <span style={{ fontWeight: 'bold', fontSize: '11px' }}>For Appointments: 040-1234-5678</span>
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
