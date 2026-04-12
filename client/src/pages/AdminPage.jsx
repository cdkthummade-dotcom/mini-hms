import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import MasterManager from '../components/admin/MasterManager';
import PatientSearch from '../components/admin/PatientSearch';
import UserManagement from '../components/admin/UserManagement';
import AuditLog from '../components/admin/AuditLog';
import SessionTimer from '../components/shared/SessionTimer';

// SVG icons for sidebar navigation
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  ),
  patients: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  masters: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="2"/><path d="M19 8v1"/><path d="M19 13v1"/><path d="M17.12 9.88l.7.7"/><path d="M20.17 12.93l.7.7"/><path d="M17.12 12.17l.7-.7"/><path d="M20.17 9.12l.7-.7"/></svg>
  ),
  audit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ),
};

const NAV = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'patients', label: 'Patient Records' },
  { key: 'masters', label: 'Masters' },
  { key: 'users', label: 'User Management' },
  { key: 'audit', label: 'Audit Log' },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState('dashboard');

  const sections = {
    dashboard: <Dashboard />,
    patients: <PatientSearch />,
    masters: <MasterManager />,
    users: <UserManagement />,
    audit: <AuditLog />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 print:hidden shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8v6h6v8h-6v6H8v-6H2V8h6z"/></svg>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Demo Hospital</h1>
              <p className="text-xs text-blue-200 mt-0.5">Welcome, {user?.fullName} <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs font-medium ml-1">{user?.role}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SessionTimer />
            <button onClick={logout} className="text-sm text-red-200 hover:text-white font-medium transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 shrink-0 print:hidden shadow-sm">
          <nav className="py-3">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 text-left
                  ${section === item.key
                    ? 'bg-blue-50 text-blue-700 border-r-3 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <span className={section === item.key ? 'text-blue-600' : 'text-gray-400'}>{Icons[item.key]}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {sections[section]}
        </main>
      </div>
    </div>
  );
}
