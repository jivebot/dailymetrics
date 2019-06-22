import React from 'react';
import format from 'date-fns/format';
import RadioList from './RadioList';
import TextField from './TextField';

const valueComponents = {
  'boolean': [RadioList, { options: [[0, "No"], [1, "Yes"]] }],
  'number':  [TextField]
};

function createValueComponent(metricType, commonProps) {
  const [klass, specialProps] = valueComponents[metricType];
  const props = { ...commonProps, ...specialProps };
  return React.createElement(klass, props, null);
}

export default function({ metric, dataPoint, setDataPoint, date }) {
  const value = dataPoint ? dataPoint.value : '';

  const setValue = (value, localOnly) => {
    setDataPoint(metric.id, value, localOnly);
  };

  const clearValue = e => {
    e.preventDefault();
    setValue(null, false);
  };

  const valueComponent = createValueComponent(metric.metricType, { value, setValue });

  return (
    <div>
      <div id={`metric-${metric.id}`} className="card mt-4">
        <h5 className="card-header align-items-center">
          {metric.name}
        </h5>
        <div id={`data-point-${format(date, 'YYYY-MM-DD')}`} className="card-body">
          <div className="d-flex align-items-center">
            {valueComponent}
            {value !== null && 
              <div className="ml-2">
                <a href="#" onClick={clearValue} className="btn btn-outline-secondary btn-sm">Clear</a>
              </div>
            }
          </div>
          {metric.presenceStreakDays && 
            <span className="badge badge-info mt-2">{metric.presenceStreakDays}-day streak!</span>
          }
        </div>
      </div>
    </div>
  );
}
