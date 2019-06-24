import React from 'react';

export default function({ value, setValue, options }) {
  const strValue = value.toString();
  const onChange = (e) => setValue(e.target.value);

  return (
    <div>
      <div className="form-check">
        <label className="form-check-label option-unknown">
          <input type="radio" value="" onChange={onChange} checked={strValue === ""} className="form-check-input" />
          Unknown
        </label>
      </div>
      {options.map(([optValue, optLabel]) => (
        <div className="form-check" key={optValue}>
          <label className="form-check-label">
            <input type="radio" value={optValue} onChange={onChange} checked={strValue === optValue} className="form-check-input" />
            {optLabel}
          </label>
        </div>
      ))}
    </div>
  );
}
