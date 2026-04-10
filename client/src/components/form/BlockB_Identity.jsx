import { useRef } from 'react';
import imageCompression from 'browser-image-compression';
import api from '../../api/axios';
import { useMasters } from '../../context/MasterDataContext';

export default function BlockB_Identity({ data, onChange, autoFilled = {} }) {
  const { masters } = useMasters();
  const fileRef = useRef(null);

  const field = (name) => ({
    value: data[name] || '',
    onChange: (e) => onChange({ [name]: e.target.value }),
    className: `field-input ${autoFilled[name] ? 'bg-blue-50' : ''}`,
  });

  async function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 0.1, maxWidthOrHeight: 800 });
      const formData = new FormData();
      formData.append('photo', compressed);
      const { data: res } = await api.post('/api/upload/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange({ photoUrl: res.url });
    } catch {
      alert('Photo upload failed. Please try again.');
    }
  }

  return (
    <div id="block-b" className="form-block">
      <h3 className="section-label">B — Patient Identity</h3>

      {/* Photo */}
      <div className="mb-4">
        <label className="field-label">Patient Photo <span className="text-gray-400">(Optional, max 5MB)</span></label>
        <div className="flex items-center gap-4">
          {data.photoUrl && (
            <img src={data.photoUrl} alt="Patient" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
          )}
          <button type="button" onClick={() => fileRef.current.click()}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            {data.photoUrl ? 'Change Photo' : 'Upload / Capture'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhoto} />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {/* Salutation */}
        <div className="col-span-2">
          <label className="field-label">Salutation <span className="text-red-500">*</span></label>
          <select value={data.salutationId || ''} onChange={(e) => onChange({ salutationId: e.target.value })}
            className={`field-input ${autoFilled.salutationId ? 'bg-blue-50' : ''}`}>
            <option value="">Select</option>
            {masters.salutation.map((s) => <option key={s.id} value={s.id}>{s.value}</option>)}
          </select>
        </div>

        {/* First Name */}
        <div className="col-span-4 lg:col-span-2">
          <label className="field-label">First Name <span className="text-red-500">*</span></label>
          <input type="text" maxLength={50} placeholder="First name" {...field('firstName')} />
        </div>

        {/* Middle Name */}
        <div className="col-span-3 lg:col-span-1">
          <label className="field-label">Middle Name</label>
          <input type="text" maxLength={50} placeholder="Middle name" {...field('middleName')} />
        </div>

        {/* Last Name */}
        <div className="col-span-3 lg:col-span-1">
          <label className="field-label">Last Name <span className="text-red-500">*</span></label>
          <input type="text" maxLength={50} placeholder="Last name" {...field('lastName')} />
        </div>
      </div>
    </div>
  );
}
