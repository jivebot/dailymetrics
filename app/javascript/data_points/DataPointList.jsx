import React from 'react';
import DataPoint from './DataPoint';

export default function({ dataPoints, setDataPoint }) {
  return (
    <div>
      {dataPoints.map(dataPoint => (
        <DataPoint dataPoint={dataPoint} setDataPoint={setDataPoint} key={dataPoint.metric_id} />
      ))}
    </div>
  );
}
