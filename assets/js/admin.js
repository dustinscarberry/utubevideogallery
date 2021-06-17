import '../scss/admin.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './component/Dashboard';

const dashboard = document.getElementById('utv-dashboard-root');
if (dashboard)
  ReactDOM.render(<Dashboard/>, dashboard);
