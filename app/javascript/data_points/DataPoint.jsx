import React, { useState } from 'react';
import { Check, CircleSlash, X } from '@primer/octicons-react'
import OptionSelect from './OptionSelect';
import TextField from './TextField';

const valueComponents = {
  boolean: [
    OptionSelect,
    {
      options: [
        ["1", "Yes", Check, "text-success"],
        ["0", "No", X, "text-danger"],
        ["", "Clear", CircleSlash, "text-muted"]
      ]
    }
  ],
  number: [TextField]
};

function createValueComponent(metricType, commonProps) {
  const [klass, specialProps] = valueComponents[metricType];
  const props = { ...commonProps, ...specialProps };
  return React.createElement(klass, props, null);
}

export default function({ metric, onDate, dataPoint, setDataPoint }) {
  const [isEditing, setIsEditing] = useState(false);
  const value = dataPoint ? dataPoint.value : '';
  const [originalValue, setOriginalValue] = useState(value);

  const toggleIsEditing = () => {
    if (!isEditing) setOriginalValue(value);
    setIsEditing(!isEditing);
  }

  const setValue = (value, localOnly) => {
    setDataPoint(metric.id, onDate, value, localOnly);
  };

  const valueComponent = createValueComponent(
    metric.metricType,
    { metric, onDate, value, setValue, originalValue, isEditing, toggleIsEditing }
  );

  return (
    <div>
      <div className="d-sm-none">
        <h4>{metric.name}</h4>
        {metric.presenceStreakDays && 
          <span className="badge badge-info mt-2">{metric.presenceStreakDays}-day streak!</span>
        }
      </div>
      <div className="text-center">
        {valueComponent}
      </div>
    </div>
  );
}
