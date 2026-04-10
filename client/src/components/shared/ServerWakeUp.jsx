import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function ServerWakeUp({ onReady }) {
  const [status, setStatus] = useState('checking');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let timer;
    const check = async () => {
      try {
        await api.get('/api/health', { timeout: 5000 });
        setStatus('ready');
        onReady();
      } catch {
        setAttempts((a) => a + 1);
        setStatus('waking');
        timer = setTimeout(check, 3000);
      }
    };
    check();
    return () => clearTimeout(timer);
  }, [onReady]);

  if (status === 'ready') return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {attempts === 0 ? 'Connecting...' : 'Waking up server...'}
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          {attempts === 0
            ? 'Checking server status'
            : `Server is starting up. This takes about 30–60 seconds on first load. (Attempt ${attempts})`}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(attempts * 10, 90)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">Demo Hospital HMS — Patient Registration Portal</p>
      </div>
    </div>
  );
}
