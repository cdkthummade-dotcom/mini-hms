import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useMasters } from '../../context/MasterDataContext';

const MASTER_CONFIG = {
  salutation: { label: 'Salutations', valueKey: 'value', endpoint: 'salutation', refreshKey: 'salutation' },
  'patient-type': { label: 'Patient Types', valueKey: 'value', endpoint: 'patient-type', refreshKey: 'patientType' },
  'referred-by': { label: 'Referred By', valueKey: 'name', endpoint: 'referred-by', refreshKey: 'referredBy',
    extraFields: [{ key: 'type', label: 'Type', options: ['doctor', 'clinic', 'camp'] }] },
  consultant: { label: 'Consultants', valueKey: 'name', endpoint: 'consultant', refreshKey: 'consultant',
    extraFields: [
      { key: 'specialisation', label: 'Specialisation' },
      { key: 'department', label: 'Department' },
    ] },
  'identity-type': { label: 'Identity Types', valueKey: 'value', endpoint: 'identity-type', refreshKey: 'identityType' },
  'relation-type': { label: 'Relation Types', valueKey: 'value', endpoint: 'relation-type', refreshKey: 'relationType' },
  'marital-status': { label: 'Marital Status', valueKey: 'value', endpoint: 'marital-status', refreshKey: 'maritalStatus' },
};

export default function MasterManager() {
  const [selected, setSelected] = useState('salutation');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refresh } = useMasters();

  const config = MASTER_CONFIG[selected];

  useEffect(() => {
    loadItems();
  }, [selected]); // eslint-disable-line

  async function loadItems() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/masters/${config.endpoint}`);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      if (editId) {
        await api.put(`/api/masters/${config.endpoint}/${editId}`, form);
      } else {
        await api.post(`/api/masters/${config.endpoint}`, form);
      }
      setForm({});
      setEditId(null);
      await loadItems();
      await refresh(config.refreshKey);
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    }
  }

  async function deactivate(id) {
    if (!confirm('Deactivate this entry? It will be hidden from dropdowns.')) return;
    await api.delete(`/api/masters/${config.endpoint}/${id}`);
    await loadItems();
    await refresh(config.refreshKey);
  }

  const valueKey = config.valueKey;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Master Management</h2>

      {/* Master Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(MASTER_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => { setSelected(key); setForm({}); setEditId(null); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${selected === key ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            {cfg.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add / Edit Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit' : 'Add'} {config.label}</h3>
          <div className="space-y-3">
            <div>
              <label className="field-label">{config.valueKey === 'name' ? 'Name' : 'Value'} <span className="text-red-500">*</span></label>
              <input type="text" value={form[valueKey] || ''} onChange={(e) => setForm({ ...form, [valueKey]: e.target.value })}
                className="field-input" />
            </div>
            {(config.extraFields || []).map((ef) => (
              <div key={ef.key}>
                <label className="field-label">{ef.label}</label>
                {ef.options ? (
                  <select value={form[ef.key] || ''} onChange={(e) => setForm({ ...form, [ef.key]: e.target.value })} className="field-input">
                    <option value="">Select</option>
                    {ef.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" value={form[ef.key] || ''} onChange={(e) => setForm({ ...form, [ef.key]: e.target.value })} className="field-input" />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700">
                {editId ? 'Update' : 'Add'}
              </button>
              {editId && <button onClick={() => { setEditId(null); setForm({}); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">{config.label} ({items.length})</h3>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400 text-sm">No entries yet. Add one on the left.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="text-gray-800 font-medium">{item[valueKey]}</span>
                    {item.type && <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.type}</span>}
                    {item.department && <span className="ml-2 text-xs text-gray-400">— {item.department}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(item.id); setForm(item); }}
                      className="text-blue-600 text-xs hover:underline">Edit</button>
                    <button onClick={() => deactivate(item.id)}
                      className="text-red-500 text-xs hover:underline">Deactivate</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
