import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './app/App';
import { ProgressProvider } from './state/ProgressContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </BrowserRouter>
  </StrictMode>,
);
