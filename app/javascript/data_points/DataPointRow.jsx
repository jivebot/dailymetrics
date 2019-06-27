import React from 'react';
import DataPoint from './DataPoint';
import { DATE_COLUMN_CLASSES } from '../constants';
import { dateStr } from 'utils';

export default function({ metric, displayDates, dataPoints, setDataPoint }) {
  return (
    <div id={`metric-${metric.id}`} className="row mt-4">
      <div className="col-sm d-none d-sm-block">
        <h4>{metric.name}</h4>
        {metric.presenceStreakDays && 
          <span className="badge badge-info">{metric.presenceStreakDays}-day streak!</span>
        }
      </div>
      {dataPoints.map((dataPoint, i) => {
        const id = `data-point-${metric.id}-${dateStr(displayDates[i])}`;
        return (
          <div className={`col-sm ${DATE_COLUMN_CLASSES[i]}`} id={id} key={id}>
            <DataPoint metric={metric} onDate={displayDates[i]} dataPoint={dataPoint} setDataPoint={setDataPoint} />
          </div>
        );
      })}
    </div>
  );
}
