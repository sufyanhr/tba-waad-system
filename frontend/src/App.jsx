import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { JWTProvider } from 'contexts/JWTContext';

// ==============================|| APP - MANTIS STRUCTURE ||============================== //

export default function App() {
  return (
    <JWTProvider>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </JWTProvider>
  );
}
