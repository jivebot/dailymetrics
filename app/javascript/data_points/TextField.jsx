import React, { useEffect } from 'react';
import Octicon, { Pencil } from '@primer/octicons-react'
import classNames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { blank, validNumber } from 'utils';
import MissingValue from './MissingValue';

export default function({ value, setValue, originalValue, isEditing, toggleIsEditing }) {
  const displayValue = (value === null) ? '' : value.toString();
  const isValid = blank(displayValue) || validNumber(displayValue);
  const classes = classNames({
    'form-control': true,
    'is-invalid': !isValid
  });

  const enableEditing = e => {
    e.preventDefault();
    toggleIsEditing();
  };

  const [debouncedSetValue, _, callPending] = useDebouncedCallback(setValue, 500);
  const onChange = e => {
    // Update value locally
    setValue(e.target.value, true);
    // Persist value to server with debounce
    debouncedSetValue(e.target.value, false);
  };

  const onKeyDown = e => {
    const key = e.key;
    if (key === "Enter" || key === "Escape") {
      if (!isValid) setValue(originalValue);
      toggleIsEditing();
    }
  };

  // On unmount, persist any changes to server
  useEffect(() => callPending);

  return (
    <div>
      {isEditing
        ? <input value={displayValue} onChange={onChange} onKeyDown={onKeyDown} onBlur={toggleIsEditing} className={classes} autoFocus />
        : <button onClick={enableEditing} className="btn btn-link edit-value p-0 text-decoration-none">
            {(displayValue === '')
              ? <MissingValue />
              : <span className="text-success"><Octicon icon={Pencil}/> {displayValue}</span>
            }
          </button>
      }
    </div>
  );
}
