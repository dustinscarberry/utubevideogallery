import '../scss/admin.scss';
import { createRoot } from 'react-dom/client';
import Dashboard from './component/Dashboard';

const dashboardRoot = document.getElementById('utv-dashboard-root');
if (dashboardRoot)
  createRoot(dashboardRoot).render(<Dashboard/>);