import React from 'react';
import ReactDOM from 'react-dom';
import './application';
import DataPointsPage from 'data_points/DataPointsPage';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <DataPointsPage />,
    document.getElementById('root'),
  )
});
