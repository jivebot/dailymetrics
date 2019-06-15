import React from 'react';

export default function({ value, setValue, options }) {
  const onChange = (e) => setValue(parseInt(e.target.value));

  return (
    <div>
      {options.map(([optValue, optLabel]) => (
        <div className="form-check form-check-inline" key={optValue}>
          <label className="form-check-label">
            <input type="radio" value={optValue} onChange={onChange} checked={value === optValue} className="form-check-input" />
            {optLabel}
          </label>
        </div>
      ))}
    </div>
  );
}
