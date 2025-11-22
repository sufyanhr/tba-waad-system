import { BrowserRouter } from 'react-router-dom';

// project imports
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { JWTProvider } from 'contexts/JWTContext';

// ==============================|| APP - MANTIS STRUCTURE ||============================== //

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
      <JWTProvider>
        <ThemeCustomization>
          <ScrollTop>
            <Routes />
          </ScrollTop>
        </ThemeCustomization>
      </JWTProvider>
    </BrowserRouter>
  );
}
