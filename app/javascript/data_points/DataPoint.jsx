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

export default function({ dataPoint, setDataPoint, date }) {
  const { value } = dataPoint;

  const setValue = (value, localOnly) => {
    setDataPoint(dataPoint.metric_id, value, localOnly);
  };

  const clearValue = e => {
    e.preventDefault();
    setValue(null, false);
  };

  const valueComponent = createValueComponent(dataPoint.metric.metric_type, { value, setValue });

  return (
    <div>
      <div id={`metric-${dataPoint.metric_id}`} className="card mt-4">
        <h5 className="card-header align-items-center">
          {dataPoint.metric.name}
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
          {dataPoint.metric.presence_streak_days && 
            <span className="badge badge-info mt-2">{dataPoint.metric.presence_streak_days}-day streak!</span>
          }
        </div>
      </div>
    </div>
  );
}
