import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import AdminDashboard from './pages/AdminDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import ViewerDashboard from './pages/ViewerDashboard';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['company-admin', 'staff', 'viewer']}><CompanyDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/company/*" element={<ProtectedRoute allowedRoles={['company-admin', 'staff', 'viewer']}><CompanyDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/viewer/*" element={<ProtectedRoute allowedRoles={['viewer', 'company-admin']}><ViewerDashboard /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;