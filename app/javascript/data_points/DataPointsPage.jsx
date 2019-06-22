import React, { useEffect, useReducer } from 'react';
import { addDays, format, isBefore, startOfToday } from 'date-fns';
import DataPointList from './DataPointList';
import { getDataPoints, postDataPoint } from '../api';
import { blank, validNumber } from 'utils';

function updateDataPoint(dataPoints, metricId, fn) {
  return dataPoints.map(d => {
    return (d.metric_id === metricId) ? fn(d) : d;
  });
}

const initialState = {
  date: startOfToday(),
  dataPoints: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE_DATE':
      return { ...state, date: addDays(state.date, action.delta), dataPoints: [] };
    case 'SET_DATA_POINTS':
      return { ...state, dataPoints: action.dataPoints };
    case 'SET_VALUE':
      return {
        ...state,
        dataPoints: updateDataPoint(state.dataPoints, action.metricId, d => ({ ...d, value: action.value }))
      };
    case 'UPDATE_METRIC':
      return {
        ...state,
        dataPoints: updateDataPoint(state.dataPoints, action.metricId, d => ({ ...d, metric: action.metric }))
      };
    default:
      throw new Error();
  }
}

export default function() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, dataPoints } = state;

  const changeDate = delta => {
    return e => {
      e.preventDefault();
      dispatch({ type: 'CHANGE_DATE', delta });
    };
  };

  const setDataPoint = (metricId, value, localOnly) => {
    dispatch({ type: 'SET_VALUE', metricId, value });

    if (localOnly) return;

    if (blank(value) || validNumber(value)) {
      postDataPoint(metricId, date, value)
        .then(({ data }) => {
          dispatch({ type: 'UPDATE_METRIC', metricId, metric: data.metric });
        })
        .catch(() => console.log('Unable to persist value'));
    }
  };

  useEffect(() => {
    getDataPoints(date)
      .then(result => dispatch({ type: 'SET_DATA_POINTS', dataPoints: result.data }));
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
      <DataPointList dataPoints={dataPoints} setDataPoint={setDataPoint} date={date} />
    </div>
  );
}
