import { useRef } from 'react';
import api from '../../api/axios';

export default function BlockG_MLC({ data, onChange }) {
  const docRef = useRef(null);

  async function handleDocUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    try {
      const { data: res } = await api.post('/api/upload/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange({ mlcDocumentUrl: res.url });
    } catch {
      alert('Document upload failed. Please try again.');
    }
  }

  return (
    <div id="block-g" className="form-block border-l-4 border-red-400">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          id="mlc-checkbox"
          checked={data.isMlc || false}
          onChange={(e) => onChange({ isMlc: e.target.checked })}
          className="w-5 h-5 accent-red-600"
        />
        <label htmlFor="mlc-checkbox" className="section-label mb-0 cursor-pointer text-red-700">
          G — MLC (Medico-Legal Case)
        </label>
      </div>

      {/* MLC fields — only rendered when checked */}
      {data.isMlc && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Accompanied By</label>
            <input type="text" maxLength={100} value={data.mlcAccompaniedBy || ''}
              onChange={(e) => onChange({ mlcAccompaniedBy: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Accompanied Person Phone</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-lg">+91</span>
              <input type="tel" maxLength={10} value={data.mlcAccompaniedPhone || ''}
                onChange={(e) => onChange({ mlcAccompaniedPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="field-input rounded-l-none" />
            </div>
          </div>
          <div>
            <label className="field-label">Police Batch No</label>
            <input type="text" maxLength={150} value={data.mlcPoliceBatchNo || ''}
              onChange={(e) => onChange({ mlcPoliceBatchNo: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label">Incident Spot</label>
            <input type="text" maxLength={150} value={data.mlcIncidentSpot || ''}
              onChange={(e) => onChange({ mlcIncidentSpot: e.target.value })} className="field-input" />
          </div>
          <div className="col-span-2">
            <label className="field-label">MLC Remarks</label>
            <input type="text" maxLength={150} value={data.mlcRemarks || ''}
              onChange={(e) => onChange({ mlcRemarks: e.target.value })} className="field-input" />
          </div>
          <div className="col-span-2">
            <label className="field-label">MLC Document Upload</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => docRef.current.click()}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                {data.mlcDocumentUrl ? 'Change Document' : 'Upload Document (PDF/Image)'}
              </button>
              {data.mlcDocumentUrl && (
                <a href={data.mlcDocumentUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">View</a>
              )}
              <input ref={docRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleDocUpload} />
            </div>
            {!data.mlcDocumentUrl && (
              <p className="text-orange-500 text-xs mt-1">
                MLC document not uploaded — please upload within 24 hours
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
