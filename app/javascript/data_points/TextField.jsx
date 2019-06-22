import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { blank, validNumber } from 'utils';

export default function({ value, setValue }) {
  const displayValue = (value === null) ? '' : value.toString();
  const classes = classNames({
    'form-control': true,
    'is-invalid': !(blank(displayValue) || validNumber(displayValue))
  });

  const [debouncedSetValue, _, callPending] = useDebouncedCallback(setValue, 500);
  const onChange = e => {
    // Update value locally
    setValue(e.target.value, true);
    // Persist value to server with debounce
    debouncedSetValue(e.target.value, false);
  };

  // On unmount, persist any changes to server
  useEffect(() => callPending);

  return (
    <div>
      <input value={displayValue} onChange={onChange} className={classes} />
    </div>
  );
}
