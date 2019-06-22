import React from 'react';
import DataPoint from './DataPoint';

export default function({ metrics, setDataPoint, date }) {
  return (
    <div>
      {metrics.map(metric => (
        <DataPoint metric={metric} dataPoint={metric.dataPoint} setDataPoint={setDataPoint} date={date} key={metric.id} />
      ))}
    </div>
  );
}
