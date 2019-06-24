import React from 'react';
import { format } from 'date-fns';
import DataPointRow from './DataPointRow';

export default function({ metrics, displayDates, setDataPoint }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm d-none d-sm-block">
        </div>
        <div className="col-sm d-none d-lg-block">
          <h4 className="date-heading">{format(displayDates[0], 'MMM D')}</h4>
        </div>
        <div className="col-sm d-none d-md-block">
          <h4 className="date-heading">{format(displayDates[1], 'MMM D')}</h4>
        </div>
        <div className="col-sm d-none d-sm-block">
          <h4 className="date-heading">{format(displayDates[2], 'MMM D')}</h4>
        </div>
        <div className="col-sm">
          <h4 className="date-heading">{format(displayDates[3], 'MMM D')}</h4>
        </div>
      </div>

      {metrics.map(metric => (
        <DataPointRow metric={metric} displayDates={displayDates} dataPoints={metric.dataPoints} setDataPoint={setDataPoint} key={metric.id} />
      ))}
    </div>
  );
}
