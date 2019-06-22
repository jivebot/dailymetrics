import React, { useEffect, useReducer } from 'react';
import produce from 'immer';
import { addDays, format, isBefore, startOfToday } from 'date-fns';
import DataPointList from './DataPointList';
import { getDataPoints, postDataPoint } from '../api';
import { blank, validNumber, dateStr } from 'utils';

const initialState = {
  date: startOfToday(),
  isLoaded: false,
  metrics: {},
  dataPoints: {}
};

function reducer(state, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'CHANGE_DATE':
        draft.date = addDays(state.date, action.delta);
        break;
      case 'LOAD_DATA_POINTS':
        const { data_points: dataPoints, metrics } = action.payload;

        if (metrics) {
          draft.loaded = true;
          metrics.forEach(m => {
            draft.metrics[m.id] = m;
            draft.dataPoints[m.id] = {};
          });
        }

        dataPoints.forEach(dp => {
          draft.dataPoints[dp.metricId][dateStr(action.date)] = dp;
        });

        break;
      case 'SET_VALUE':
        draft.dataPoints[action.metricId][dateStr(action.date)] =
          { ...draft.dataPoints[action.metricId][dateStr(action.date)], value: action.value };
        break;
      case 'UPDATE_METRIC':
        draft.metrics[action.metric.id] = action.metric;
        break;
    }
  });
}

export default function() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, metrics, dataPoints } = state;

  const metricsWithData = Object.values(metrics).map(metric => {
    return { ...metric, dataPoint: dataPoints[metric.id][dateStr(date)] };
  });

  const changeDate = delta => {
    return e => {
      e.preventDefault();
      dispatch({ type: 'CHANGE_DATE', delta });
    };
  };

  const setDataPoint = (metricId, value, localOnly) => {
    dispatch({ type: 'SET_VALUE', metricId, date, value });

    if (localOnly) return;

    if (blank(value) || validNumber(value)) {
      postDataPoint(metricId, date, value)
        .then(({ data }) => dispatch({ type: 'UPDATE_METRIC', metric: data }))
        .catch(() => console.log('Unable to persist value'));
    }
  };

  useEffect(() => {
    const loadMetrics = !state.isLoaded;
    getDataPoints(date, loadMetrics)
      .then(({ data }) => dispatch({ type: 'LOAD_DATA_POINTS', date, payload: data }));
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
      <DataPointList metrics={metricsWithData} setDataPoint={setDataPoint} date={date} />
    </div>
  );
}
