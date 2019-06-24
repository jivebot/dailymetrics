import React from 'react';
import { dateStr } from 'utils';

export default function({ metric, onDate, value, setValue, options }) {
  const strValue = value.toString();
  const onChange = (e) => setValue(e.target.value);

  return (
    <div>
      <div className="form-check">
        <label className="form-check-label option-unknown">
          <input type="radio" name={`${metric.id}-${dateStr(onDate)}`} value="" onChange={onChange} checked={strValue === ""} className="form-check-input" />
          Unknown
        </label>
      </div>
      {options.map(([optValue, optLabel]) => (
        <div className="form-check" key={optValue}>
          <label className="form-check-label">
            <input type="radio" name={`${metric.id}-${dateStr(onDate)}`} value={optValue} onChange={onChange} checked={strValue === optValue} className="form-check-input" />
            {optLabel}
          </label>
        </div>
      ))}
    </div>
  );
}
