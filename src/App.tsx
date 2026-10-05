import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Home } from './pages/Home';

// Code-split routes for optimal Lighthouse performance
const ProjectDetails = lazy(() => import('./pages/ProjectDetails').then(m => ({ default: m.ProjectDetails })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SimpleAdminDashboard = lazy(() => import('./pages/SimpleAdminDashboard').then(m => ({ default: m.SimpleAdminDashboard })));
const AdminDebug = lazy(() => import('./pages/AdminDebug').then(m => ({ default: m.AdminDebug })));

const PageLoader = () => (
  <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center text-white">
    <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin mb-3" />
    <span className="text-xs font-mono text-zinc-400">Loading experience...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/simple" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/debug" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/test" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/education" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/certifications" element={<Navigate to="/admin" replace />} />
              <Route path="/education" element={<Navigate to="/#education" replace />} />
              <Route path="/certifications" element={<Navigate to="/#certifications" replace />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
