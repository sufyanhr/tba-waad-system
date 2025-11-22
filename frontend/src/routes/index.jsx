import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';

import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';
import Loadable from 'components/Loadable';

// render - landing page
const PagesLanding = Loadable(lazy(() => import('pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.LANDING} enableElevationScroll />,
      children: [
        {
          index: true,
          element: <PagesLanding />
        }
      ]
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ]);
}
