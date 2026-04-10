import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/ageCalculator';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', role: 'receptionist' });
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('users');
  const [msg, setMsg] = useState('');

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    const { data } = await api.get('/api/users');
    setUsers(data);
  }

  async function loadSessions() {
    const { data } = await api.get('/api/users/sessions/active');
    setSessions(data);
  }

  useEffect(() => {
    if (tab === 'sessions') loadSessions();
  }, [tab]);

  async function saveUser() {
    try {
      if (editId) {
        await api.put(`/api/users/${editId}`, { fullName: form.fullName, role: form.role, password: form.password || undefined });
      } else {
        await api.post('/api/users', form);
      }
      setForm({ username: '', password: '', fullName: '', role: 'receptionist' });
      setEditId(null);
      setMsg('User saved.');
      loadUsers();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Save failed');
    }
  }

  async function deactivate(id) {
    if (!confirm('Deactivate this user? They will not be able to log in.')) return;
    await api.delete(`/api/users/${id}`);
    loadUsers();
    setMsg('User deactivated.');
  }

  async function forceLogout(sid) {
    await api.delete(`/api/users/sessions/${sid}`);
    setMsg('Session terminated.');
    loadSessions();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">User Management</h2>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'users' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600'}`}>Staff Users</button>
        <button onClick={() => setTab('sessions')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'sessions' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600'}`}>Active Sessions</button>
      </div>

      {msg && <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-2 mb-4 text-sm">{msg}</div>}

      {tab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-700 mb-4">{editId ? 'Edit User' : 'Create User'}</h3>
            <div className="space-y-3">
              <div>
                <label className="field-label">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="field-input" />
              </div>
              {!editId && (
                <div>
                  <label className="field-label">Username <span className="text-red-500">*</span></label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="field-input" />
                </div>
              )}
              <div>
                <label className="field-label">{editId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field-input" />
              </div>
              <div>
                <label className="field-label">Role <span className="text-red-500">*</span></label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="field-input">
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={saveUser} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700">{editId ? 'Update' : 'Create'}</button>
                {editId && <button onClick={() => { setEditId(null); setForm({ username: '', password: '', fullName: '', role: 'receptionist' }); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>}
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Staff ({users.length})</h3>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${!u.is_active ? 'opacity-50' : ''}`}>
                  <div>
                    <span className="text-gray-800 font-medium">{u.full_name}</span>
                    <span className="ml-2 text-gray-500 text-sm">@{u.username}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded font-medium
                      ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                    {!u.is_active && <span className="ml-2 text-xs text-red-500">(Inactive)</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(u.id); setForm({ fullName: u.full_name, role: u.role, password: '', username: u.username }); }}
                      className="text-blue-600 text-xs hover:underline">Edit</button>
                    {u.is_active && <button onClick={() => deactivate(u.id)} className="text-red-500 text-xs hover:underline">Deactivate</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'sessions' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Active Sessions ({sessions.length})</h3>
            <button onClick={loadSessions} className="text-blue-600 text-sm hover:underline">Refresh</button>
          </div>
          {sessions.length === 0 ? (
            <p className="text-gray-400 text-sm">No active sessions</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.sessionId} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="font-medium text-gray-800">{s.fullName}</span>
                    <span className="ml-2 text-gray-500 text-sm">@{s.username}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded ${s.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : s.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{s.role}</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Logged in: {formatDateTime(s.loginTime)} | Expires: {formatDateTime(s.expiresAt)}
                    </p>
                  </div>
                  <button onClick={() => forceLogout(s.sessionId)}
                    className="border border-red-300 text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50">
                    Force Logout
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
