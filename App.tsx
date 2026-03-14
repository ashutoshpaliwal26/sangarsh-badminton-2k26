/**
 * App.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root application component.
 * Sets up React Router v6 with two routes:
 *   / → LandingPage
 *   /register → RegistrationForm
 *
 * The <ScrollToTop> component ensures the page scrolls to the top on every
 * route change — essential for multi-page SPAs.
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RegistrationForm from './pages/RegistrationForm';

import './styles/global.css';

// ─── ScrollToTop ──────────────────────────────────────────────────────────────
/**
 * Scrolls the window to the top whenever the pathname changes.
 * Must be rendered *inside* <Router> so it can access location context.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  return (
    <Router>
      {/* Scroll reset on route change */}
      <ScrollToTop />

      {/*
       * Routes — no shared layout shell needed; each page handles
       * its own nav/footer. This allows the landing page and
       * registration page to have distinct visual treatments.
       */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Catch-all — redirects unknown routes back to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
