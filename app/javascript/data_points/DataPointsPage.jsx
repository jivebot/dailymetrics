import React, { useEffect, useReducer } from 'react';
import produce from 'immer';
import { addDays, isBefore, startOfToday } from 'date-fns';
import DataPointGrid from './DataPointGrid';
import { getDataPoints, postDataPoint } from 'api';
import { NUM_DATE_COLUMNS } from '../constants';
import { blank, validNumber, dateStr, datesEndingOn } from 'utils';

const initialState = {
  currentDate: startOfToday(),
  datesLoaded: {},
  metrics: {},
  dataPoints: {}
};

function reducer(state, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'CHANGE_DATE':
        draft.currentDate = addDays(state.currentDate, action.delta);
        break;
      case 'LOAD_DATA_POINTS':
        const { data_points: dataPoints, metrics } = action.payload;

        if (metrics) {
          metrics.forEach(m => {
            draft.metrics[m.id] = m;
            draft.dataPoints[m.id] = {};
          });
        }

        action.dates.forEach(date => {
          draft.datesLoaded[dateStr(date)] = true;
        });

        dataPoints.forEach(dp => {
          draft.dataPoints[dp.metricId][dp.onDate] = dp;
        });

        break;
      case 'SET_VALUE':
        draft.dataPoints[action.metricId][dateStr(action.onDate)] =
          { ...draft.dataPoints[action.metricId][dateStr(action.onDate)], value: action.value };
        break;
      case 'UPDATE_METRIC':
        draft.metrics[action.metric.id] = action.metric;
        break;
    }
  });
}

export default function() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentDate, datesLoaded, metrics, dataPoints } = state;

  const displayDates = datesEndingOn(currentDate, NUM_DATE_COLUMNS);

  const metricsWithData = Object.values(metrics).map(metric => {
    const dateData = displayDates.map(dd => dataPoints[metric.id][dateStr(dd)]);
    return { ...metric, dataPoints: dateData };
  });

  const changeDate = delta => {
    return e => {
      e.preventDefault();
      dispatch({ type: 'CHANGE_DATE', delta });
    };
  };

  const setDataPoint = (metricId, onDate, value, localOnly) => {
    dispatch({ type: 'SET_VALUE', metricId, onDate, value });

    if (localOnly) return;

    if (blank(value) || validNumber(value)) {
      postDataPoint(metricId, onDate, value)
        .then(({ data }) => dispatch({ type: 'UPDATE_METRIC', metric: data }))
        .catch(() => console.log('Unable to persist value'));
    }
  };

  useEffect(() => {
    const datesToLoad = displayDates.reduce((arr, date) => {
      if (!datesLoaded[dateStr(date)]) arr.push(date);
      return arr;
    }, []);

    if (datesToLoad.length > 0) {
      const loadMetrics = Object.keys(datesLoaded).length == 0;
      getDataPoints(datesToLoad, loadMetrics)
        .then(({ data }) => dispatch({ type: 'LOAD_DATA_POINTS', dates: datesToLoad, payload: data }));
    }
  }, [currentDate]);

  return (
    <div>
      <h3 className="mt-5">
        <a href="#" onClick={changeDate(-1)} id="prev-date-link" className="date-link">&#9664;</a>
        {isBefore(currentDate, startOfToday()) && 
          <a href="#" onClick={changeDate(1)} id="next-date-link" className="date-link">&#9654;</a>
        }
      </h3>
      <DataPointGrid metrics={metricsWithData} setDataPoint={setDataPoint} displayDates={displayDates} />
    </div>
  );
}
