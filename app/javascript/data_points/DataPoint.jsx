import React from 'react';
import RadioList from './RadioList';
import TextField from './TextField';
import { dateStr } from 'utils';

const valueComponents = {
  'boolean': [RadioList, { options: [["1", "Yes"], ["0", "No"]] }],
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
    </div>
  );
}
