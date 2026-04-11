import { useEffect, useRef, lazy, Suspense } from 'react';

const PrintReceipt = lazy(() => import('./PrintReceipt'));

export default function UIDConfirmation({ uid, patient, dailyToken, onRegisterAnother }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (!uid || !barcodeRef.current) return;
    import('jsbarcode').then(({ default: JsBarcode }) => {
      JsBarcode(barcodeRef.current, uid, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: false,
      });
    });
  }, [uid]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Success Banner */}
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center mb-6">
        <div className="text-green-600 text-5xl mb-2">✓</div>
        <h2 className="text-2xl font-bold text-green-700 mb-1">Patient Registered Successfully!</h2>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-1">Patient UID</p>
          <p className="text-4xl font-black text-gray-900 tracking-wider font-mono">{uid}</p>
          <svg ref={barcodeRef} className="mx-auto mt-3" />
        </div>
      </div>

      {/* Patient Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div><span className="text-gray-500">Name:</span> <strong>{patient?.salutation} {patient?.firstName} {patient?.lastName}</strong></div>
          <div><span className="text-gray-500">Gender:</span> <strong>{patient?.gender}</strong></div>
          <div><span className="text-gray-500">Mobile:</span> <strong>+91 {patient?.mobile}</strong></div>
          <div><span className="text-gray-500">Patient Type:</span> <strong>{patient?.patientTypeName}</strong></div>
          {patient?.isMlc && <div className="col-span-2 text-red-600 font-bold">MLC Case</div>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center print:hidden">
        <Suspense fallback={null}>
          <PrintReceipt uid={uid} patient={patient} dailyToken={dailyToken} />
        </Suspense>
        <button
          onClick={onRegisterAnother}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Register Another Patient
        </button>
      </div>
    </div>
  );
}
