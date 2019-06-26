import React from 'react';
import { format } from 'date-fns';
import DataPointRow from './DataPointRow';
import { DATE_COLUMN_CLASSES } from '../constants';

export default function({ metrics, displayDates, setDataPoint }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm d-none d-sm-block">
        </div>
        {displayDates.map((date, i) => (
          <div className={`col-sm ${DATE_COLUMN_CLASSES[i]}`} key={i}>
            <h4 className="date-heading text-center">
              <span className="badge badge-light">{format(date, 'ddd')}<br />{format(date, 'M-D-YY')}</span>
            </h4>
          </div>
        ))}
      </div>

      {metrics.map(metric => (
        <DataPointRow metric={metric} displayDates={displayDates} dataPoints={metric.dataPoints} setDataPoint={setDataPoint} key={metric.id} />
      ))}
    </div>
  );
}
