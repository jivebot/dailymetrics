import React from 'react';
import DataPoint from './DataPoint';

export default function({ dataPoints, setDataPoint, date }) {
  return (
    <div>
      {dataPoints.map(dataPoint => (
        <DataPoint dataPoint={dataPoint} setDataPoint={setDataPoint} date={date} key={dataPoint.metric_id} />
      ))}
    </div>
  );
}
