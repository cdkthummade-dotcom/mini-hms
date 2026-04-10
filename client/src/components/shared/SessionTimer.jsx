import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/ageCalculator';

export default function SessionTimer() {
  const { user, logout } = useAuth();
  const [remaining, setRemaining] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!user?.expiresAt) return;

    const tick = () => {
      const ms = new Date(user.expiresAt) - new Date();
      if (ms <= 0) {
        logout();
        window.location.href = '/login';
        return;
      }
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      setRemaining(`${mins}m ${secs}s`);
      setShowWarning(ms < 15 * 60 * 1000);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [user, logout]);

  if (!user) return null;

  return (
    <>
      {showWarning && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-amber-700 text-sm font-medium">
            Your session will expire in {remaining}. Please save any work.
          </p>
        </div>
      )}
      <div className="text-xs text-gray-500 flex gap-4">
        <span>Logged in at: <strong>{formatDateTime(user.loginTime)}</strong></span>
        <span>Expires at: <strong>{formatDateTime(user.expiresAt)}</strong></span>
        {!showWarning && remaining && <span className="text-green-600">{remaining} left</span>}
      </div>
    </>
  );
}
