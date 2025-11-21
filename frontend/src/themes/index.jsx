import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ==============================|| THEME CUSTOMIZATION ||============================== //

export default function ThemeCustomization({ children }) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#1890ff'
          },
          secondary: {
            main: '#ff4d4f'
          }
        },
        typography: {
          fontFamily: `'Public Sans', sans-serif`
        }
      }),
    []
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node
};
