import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const MasterDataContext = createContext(null);

export function MasterDataProvider({ children }) {
  const { user } = useAuth();
  const [masters, setMasters] = useState({
    salutation: [],
    patientType: [],
    referredBy: [],
    consultant: [],
    identityType: [],
    relationType: [],
    maritalStatus: [],
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setLoaded(false); return; }

    async function loadAll() {
      try {
        const [sal, pt, rb, cons, it, rt, ms] = await Promise.all([
          api.get('/api/masters/salutation'),
          api.get('/api/masters/patient-type'),
          api.get('/api/masters/referred-by'),
          api.get('/api/masters/consultant'),
          api.get('/api/masters/identity-type'),
          api.get('/api/masters/relation-type'),
          api.get('/api/masters/marital-status'),
        ]);
        setMasters({
          salutation: sal.data,
          patientType: pt.data,
          referredBy: rb.data,
          consultant: cons.data,
          identityType: it.data,
          relationType: rt.data,
          maritalStatus: ms.data,
        });
        setLoaded(true);
      } catch (err) {
        console.error('Failed to load masters:', err.message);
        setLoaded(true); // Still mark loaded to unblock UI
      }
    }

    loadAll();
  }, [user]);

  const refresh = async (masterKey) => {
    try {
      const endpoint = {
        salutation: '/api/masters/salutation',
        patientType: '/api/masters/patient-type',
        referredBy: '/api/masters/referred-by',
        consultant: '/api/masters/consultant',
        identityType: '/api/masters/identity-type',
        relationType: '/api/masters/relation-type',
        maritalStatus: '/api/masters/marital-status',
      }[masterKey];
      if (!endpoint) return;
      const { data } = await api.get(endpoint);
      setMasters((prev) => ({ ...prev, [masterKey]: data }));
    } catch (err) {
      console.error('Master refresh failed:', err.message);
    }
  };

  return (
    <MasterDataContext.Provider value={{ masters, loaded, refresh }}>
      {children}
    </MasterDataContext.Provider>
  );
}

export function useMasters() {
  return useContext(MasterDataContext);
}
