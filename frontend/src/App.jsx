import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { ConfigProvider } from 'contexts/ConfigContext';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import Metrics from 'metrics';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <>
      <ConfigProvider>
        <ThemeCustomization>
          <RTLLayout>
            <Locales>
              <ScrollTop>
                <Notistack>
                  <RouterProvider router={router} />
                  <Snackbar />
                  <Toaster position="top-right" gutter={8} toastOptions={{ duration: 4000 }} />
                </Notistack>
              </ScrollTop>
            </Locales>
          </RTLLayout>
        </ThemeCustomization>
      </ConfigProvider>
      <Metrics />
    </>
  );
}
