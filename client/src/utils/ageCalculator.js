/**
 * Calculate age from date of birth.
 * Returns { years, months, days, display }
 * Date format throughout app: DD-MM-YYYY
 */
export function calculateAge(dob) {
  if (!dob) return { years: 0, months: 0, days: 0, display: '' };

  const birth = new Date(dob);
  const today = new Date();

  if (birth > today) return null; // Future date — invalid

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const display = `${years} Yrs ${months} Mo ${days} Days`;
  return { years, months, days, display };
}

/**
 * Format a date as DD-MM-YYYY
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Format a datetime as DD-MM-YYYY HH:MM AM/PM
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  let hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${dd}-${mm}-${yyyy} ${hours}:${mins} ${ampm}`;
}
