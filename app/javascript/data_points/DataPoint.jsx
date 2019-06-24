import React from 'react';
import RadioList from './RadioList';
import TextField from './TextField';
import { dateStr } from 'utils';

const valueComponents = {
  'boolean': [RadioList, { options: [[0, "No"], [1, "Yes"]] }],
  'number':  [TextField]
};

function createValueComponent(metricType, commonProps) {
  const [klass, specialProps] = valueComponents[metricType];
  const props = { ...commonProps, ...specialProps };
  return React.createElement(klass, props, null);
}

export default function({ metric, onDate, dataPoint, setDataPoint }) {
  const value = dataPoint ? dataPoint.value : '';

  const setValue = (value, localOnly) => {
    setDataPoint(metric.id, onDate, value, localOnly);
  };

  const clearValue = e => {
    e.preventDefault();
    setValue(null, false);
  };

  const valueComponent = createValueComponent(metric.metricType, { value, setValue });

  return (
    <div id={`data-point-${metric.id}-${dateStr(onDate)}`}>
      <div className="d-sm-none">
        <h4>{metric.name}</h4>
        {metric.presenceStreakDays && 
          <span className="badge badge-info mt-2">{metric.presenceStreakDays}-day streak!</span>
        }
      </div>
      {valueComponent}
      {value !== '' &&
        <div className="mt-1">
          <a href="#" onClick={clearValue} className="btn btn-outline-secondary btn-sm">Clear</a>
        </div>
      }
    </div>
  );
}
