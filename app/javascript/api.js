import axios from 'axios';
import format from 'date-fns/format';

export function getDataPoints(dates, loadMetrics) {
  return axios.get('/data_points.json', {
    params: {
      dates: dates.map(d => format(d, 'YYYY-MM-DD')),
      load_metrics: loadMetrics ? '1' : ''
    }
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
