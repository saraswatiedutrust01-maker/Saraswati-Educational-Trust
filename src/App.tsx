import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FocusAreasPage } from './pages/FocusAreasPage';
import { ProgrammesPage } from './pages/ProgrammesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ImpactPage, StoriesPage, ActivitiesPage } from './pages/ImpactStoriesEventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  return (
    <ErrorBoundary>
      <SiteProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout quotaExceeded={quotaExceeded}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* About Us & All 11 Inner Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/profile" element={<AboutPage />} />
              <Route path="/about/vision-mission" element={<AboutPage />} />
              <Route path="/about/objectives" element={<AboutPage />} />
              <Route path="/about/focus-areas" element={<AboutPage />} />
              <Route path="/about/approach" element={<AboutPage />} />
              <Route path="/about/coverage" element={<AboutPage />} />
              <Route path="/about/governing-body" element={<AboutPage />} />
              <Route path="/about/team" element={<AboutPage />} />
              <Route path="/about/secretary-message" element={<AboutPage />} />
              <Route path="/about/challenges" element={<AboutPage />} />

              {/* Core Sections */}
              <Route path="/focus-areas" element={<FocusAreasPage />} />
              <Route path="/programmes" element={<ProgrammesPage />} />
              <Route path="/programmes/:slug" element={<ProgrammesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectsPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/stories/:slug" element={<StoriesPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/get-involved" element={<GetInvolvedPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/policies/:slug" element={<PoliciesPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </SiteProvider>
    </ErrorBoundary>
  );
}
