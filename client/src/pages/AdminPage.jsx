import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import MasterManager from '../components/admin/MasterManager';
import PatientSearch from '../components/admin/PatientSearch';
import UserManagement from '../components/admin/UserManagement';
import AuditLog from '../components/admin/AuditLog';
import SessionTimer from '../components/shared/SessionTimer';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { key: 'patients', label: 'Patient Records', icon: '⊙' },
  { key: 'masters', label: 'Masters', icon: '⊡' },
  { key: 'users', label: 'User Management', icon: '⊂' },
  { key: 'audit', label: 'Audit Log', icon: '⊠' },
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
      <header className="bg-white border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-blue-800 text-lg">Demo Hospital — Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-0.5">Welcome, {user?.fullName} <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium ml-1">{user?.role}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <SessionTimer />
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 shrink-0 print:hidden">
          <nav className="py-4">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left
                  ${section === item.key
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="text-lg">{item.icon}</span>
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
