import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children, serverReady }) {
  const [user, setUser] = useState(null);
  // Keep loading=true until we know server is ready AND we've checked the session.
  // This prevents the ProtectedRoute from flashing the login page during cold-start.
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    // Per-tab guard: sessionStorage is unique per tab, so a new tab
    // won't have this flag and will force re-login even if the
    // server-side session cookie is still valid.
    if (!sessionStorage.getItem('hms_tab_auth')) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data);
    } catch {
      setUser(null);
      sessionStorage.removeItem('hms_tab_auth');
      sessionStorage.removeItem('hms_token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Only check session once the server is confirmed awake.
  // serverReady is undefined when used without the prop (e.g. in tests),
  // so we treat undefined as "ready" for backward compatibility.
  useEffect(() => {
    if (serverReady === false) return; // still waking up — stay in loading state
    fetchMe();
  }, [serverReady, fetchMe]);

  const login = async (username, password) => {
    const { data } = await api.post('/api/auth/login', { username, password });
    // Mark this tab as authenticated (per-tab, not shared across tabs)
    sessionStorage.setItem('hms_tab_auth', 'true');
    // Save JWT token for devices that block third-party cookies.
    // sessionStorage (not localStorage) so it dies when the tab is closed.
    if (data.token) {
      sessionStorage.setItem('hms_token', data.token);
    }
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (_) { /* best effort — session may already be expired */ }
    sessionStorage.removeItem('hms_tab_auth');
    sessionStorage.removeItem('hms_token');
    setUser(null);
    const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    window.location.replace(`${base}/login`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
