import React from 'react';
import RadioList from './RadioList';

export default function({ dataPoint, setDataPoint }) {
  const { value } = dataPoint;

  const setValue = value => {
    setDataPoint(dataPoint.metric_id, value);
  };

  const clearValue = e => {
    e.preventDefault();
    setValue(null);
  };

  return (
    <div>
      <div id={`metric-${dataPoint.metric_id}`} className="card mt-4">
        <h5 className="card-header align-items-center">
          {dataPoint.metric.name}
        </h5>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <RadioList value={value} setValue={setValue} options={[[0, "No"], [1, "Yes"]]} />
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
