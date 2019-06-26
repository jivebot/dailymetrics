import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Octicon from '@primer/octicons-react'
import MissingValue from './MissingValue';

export default function({ value, setValue, options, isEditing, toggleIsEditing }) {
  const strValue = value.toString();
  const [selectedValue, selectedLabel, selectedIcon, selectedColor] = options.find(o => o[0] === strValue) || [];

  return (
    <Dropdown isOpen={isEditing} toggle={toggleIsEditing}>
      <DropdownToggle color="link" className="edit-value p-0 text-decoration-none">
        {selectedValue
          ? <span className={selectedColor}><Octicon icon={selectedIcon}/> {selectedLabel}</span>
          : <MissingValue />
        }
      </DropdownToggle>
      <DropdownMenu>
        {options.map(([optValue, optLabel, optIcon]) => (
          <DropdownItem onClick={() => setValue(optValue)} active={strValue !== '' && strValue === optValue} key={optValue || 'unknown'}>
            <Octicon icon={optIcon}/> {optLabel}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
