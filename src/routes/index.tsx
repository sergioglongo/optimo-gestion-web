import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';

// types
import DashboardLayout from 'layout/Dashboard';
import DashboardAnalytics from 'pages/dashboard/analytics';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <DashboardAnalytics />
        }
      ]
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ],
  { basename: process.env.REACT_APP_BASE_NAME }
);

export default router;
