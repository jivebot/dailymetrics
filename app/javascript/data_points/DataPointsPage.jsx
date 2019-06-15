import React, { useState, useEffect } from 'react';
import { addDays, format, isBefore, startOfToday } from 'date-fns';
import DataPointList from './DataPointList';
import { getDataPoints, postDataPoint } from '../api';

function updateDataPoint(dataPoints, metricId, fn) {
  return dataPoints.map(d => {
    return (d.metric_id === metricId) ? fn(d) : d;
  });
}

export default function() {
  const [date, setDate] = useState(startOfToday());
  const [dataPoints, setDataPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const changeDate = delta => {
    return e => {
      e.preventDefault();
      setDate(addDays(date, delta));
      setDataPoints([]);
    };
  };

  const setDataPoint = (metricId, value) => {
    if (isLoading) return;
    setIsLoading(true);

    const currentData = dataPoints;

    setDataPoints(updateDataPoint(dataPoints, metricId, d => ({ ...d, value })));

    postDataPoint(metricId, date, value)
      .then(({ data }) => {
        setDataPoints(updateDataPoint(dataPoints, metricId, d => data));
      })
      .catch(() => setDataPoints(currentData))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getDataPoints(date)
      .then(result => setDataPoints(result.data));
  }, [date]);

  return (
    <div>
      <h3 className="mt-5">
        <a href="#" onClick={changeDate(-1)} id="prev-date-link" className="date-link">&#9664;</a>
        {format(date, 'dddd, MMMM D')}
        {isBefore(date, startOfToday()) && 
          <a href="#" onClick={changeDate(1)} id="next-date-link" className="date-link">&#9654;</a>
        }
      </h3>
      <DataPointList dataPoints={dataPoints} setDataPoint={setDataPoint} />
    </div>
  );
}
