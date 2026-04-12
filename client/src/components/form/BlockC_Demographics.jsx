import { useAgeCalculator } from '../../hooks/useAgeCalculator';
import { useEffect } from 'react';

export default function BlockC_Demographics({ data, onChange, autoFilled = {} }) {
  const { ageDisplay, ageYears, ageMonths, ageDays, manualMode, fromDOB, setManual, toggleManual } = useAgeCalculator();

  useEffect(() => {
    if (data.dob) fromDOB(data.dob);
  }, [data.dob, fromDOB]);

  useEffect(() => {
    onChange({ ageYears, ageMonths, ageDays });
  }, [ageYears, ageMonths, ageDays]); // eslint-disable-line

  return (
    <div id="block-c" className="form-block">
      <h3 className="section-label">C — Demographics</h3>
      <div className="grid grid-cols-2 gap-4">

        {/* Gender */}
        <div>
          <label className="field-label">Gender <span className="text-red-500">*</span></label>
          <select
            value={data.gender || ''}
            onChange={(e) => onChange({ gender: e.target.value })}
            className={`field-input ${autoFilled.gender ? 'bg-blue-50' : ''}`}
          >
            <option value="">Select gender</option>
            {['Male', 'Female', 'Trans', 'Others'].map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="field-label">Date of Birth</label>
          <input
            type="date"
            value={data.dob || ''}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => { onChange({ dob: e.target.value }); fromDOB(e.target.value); }}
            disabled={manualMode}
            className={`field-input ${autoFilled.dob ? 'bg-blue-50' : ''} ${manualMode ? 'opacity-50' : ''}`}
          />
          <button type="button" onClick={() => toggleManual(data.dob)}
            className="text-xs text-blue-600 mt-1 underline hover:no-underline">
            {manualMode ? 'Use date picker instead' : "DOB unknown? Enter age manually"}
          </button>
        </div>

        {/* Age Display / Manual Entry */}
        <div className="col-span-2">
          {manualMode ? (
            <div>
              <label className="field-label">Age (Manual Entry)</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input type="number" min={0} max={150} placeholder="Years"
                    value={ageYears}
                    onChange={(e) => setManual(parseInt(e.target.value) || 0, ageMonths, ageDays)}
                    className="field-input" />
                  <p className="text-xs text-gray-400 mt-0.5">Years</p>
                </div>
                <div className="flex-1">
                  <input type="number" min={0} max={11} placeholder="Months"
                    value={ageMonths}
                    onChange={(e) => setManual(ageYears, parseInt(e.target.value) || 0, ageDays)}
                    className="field-input" />
                  <p className="text-xs text-gray-400 mt-0.5">Months</p>
                </div>
                <div className="flex-1">
                  <input type="number" min={0} max={31} placeholder="Days"
                    value={ageDays}
                    onChange={(e) => setManual(ageYears, ageMonths, parseInt(e.target.value) || 0)}
                    className="field-input" />
                  <p className="text-xs text-gray-400 mt-0.5">Days</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="field-label">Age</label>
              <div className="field-input bg-gray-50 text-gray-700 font-medium">
                {ageDisplay || <span className="text-gray-400">Auto-calculated from DOB</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
