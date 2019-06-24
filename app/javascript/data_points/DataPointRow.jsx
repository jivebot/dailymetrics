import React from 'react';
import DataPoint from './DataPoint';

const breakpoints = [
  "d-none d-lg-block",
  "d-none d-md-block",
  "d-none d-sm-block",
  ""
];

export default function({ metric, displayDates, dataPoints, setDataPoint }) {
  return (
    <div id={`metric-${metric.id}`} className="row mt-4">
      <div className="col-sm d-none d-sm-block">
        <h4>{metric.name}</h4>
        {metric.presenceStreakDays && 
          <span className="badge badge-info mt-2">{metric.presenceStreakDays}-day streak!</span>
        }
      </div>
      {dataPoints.map((dataPoint, i) => (
        <div className={`col-sm ${breakpoints[i]}`} key={i}>
          <DataPoint metric={metric} date={displayDates[i]} dataPoint={dataPoint} setDataPoint={setDataPoint} />
        </div>
      ))}
    </div>
  );
}
