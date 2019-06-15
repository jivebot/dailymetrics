import axios from 'axios';
import format from 'date-fns/format';

export function getDataPoints(date) {
  return axios.get('/data_points.json', {
    params: { date: format(date, 'YYYY-MM-DD') }
  });
}

export function postDataPoint(metricId, date, value) {
  const tokenTag = document.querySelector("meta[name=csrf-token]");

  return axios.post('/data_points.json', {
      metric_id: metricId,
      date: format(date, 'YYYY-MM-DD'),
      value: value
    },
    {
      headers: { 'X-CSRF-Token': tokenTag && tokenTag.content }
    }
  );
}
