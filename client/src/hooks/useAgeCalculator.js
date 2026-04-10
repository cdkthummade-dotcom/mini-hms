import { useState, useCallback } from 'react';
import { calculateAge } from '../utils/ageCalculator';

export function useAgeCalculator() {
  const [ageDisplay, setAgeDisplay] = useState('');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [ageDays, setAgeDays] = useState(0);
  const [manualMode, setManualMode] = useState(false);

  const fromDOB = useCallback((dob) => {
    if (!dob || manualMode) return;
    const result = calculateAge(dob);
    if (!result) { setAgeDisplay('Invalid date'); return; }
    setAgeYears(result.years);
    setAgeMonths(result.months);
    setAgeDays(result.days);
    setAgeDisplay(result.display);
  }, [manualMode]);

  const setManual = useCallback((years, months, days) => {
    setAgeYears(years || 0);
    setAgeMonths(months || 0);
    setAgeDays(days || 0);
    setAgeDisplay(`${years || 0} Yrs ${months || 0} Mo ${days || 0} Days`);
  }, []);

  const toggleManual = useCallback(() => {
    setManualMode((prev) => !prev);
    setAgeDisplay('');
    setAgeYears(0); setAgeMonths(0); setAgeDays(0);
  }, []);

  return { ageDisplay, ageYears, ageMonths, ageDays, manualMode, fromDOB, setManual, toggleManual };
}
