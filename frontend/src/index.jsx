import React from 'react';
import { createRoot } from 'react-dom/client';

// style & fonts imports
import 'assets/style.css';
import 'simplebar-react/dist/simplebar.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'assets/third-party/apex-chart.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

import App from './App';
import { JWTProvider } from 'contexts/JWTContext';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <JWTProvider>
    <App />
  </JWTProvider>
);

reportWebVitals();
