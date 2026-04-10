import { useState, useCallback, useRef } from 'react';
import api from '../api/axios';

export function useEmployeeAutofill(onFill) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async (empId) => {
    if (!empId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/api/employees/${empId}`);
      onFill(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Employee not found');
    } finally {
      setLoading(false);
    }
  }, [onFill]);

  return { fetch, loading, error };
}

export function usePincodeAutofill(onFill) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const debounceRef = useRef(null);

  const lookup = useCallback((pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setMessage('');
      try {
        const { data } = await api.get(`/api/pincode/${pincode}`);
        onFill(data, false);
      } catch {
        setMessage('Could not fetch pincode details, please fill manually');
        onFill(null, true); // trigger manual mode
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [onFill]);

  return { lookup, loading, message };
}
