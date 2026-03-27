import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx'; // Import the Provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The AuthProvider MUST wrap the App so every page can see the user data */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);