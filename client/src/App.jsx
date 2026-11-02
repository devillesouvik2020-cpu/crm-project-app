import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Language from './pages/Language';
import Payroll from './pages/Payroll';
import CompanySettings from './pages/CompanySettings';
import Invite from './pages/Invite';
import CrmDashboard from './pages/CrmDashboard';
import Resources from './pages/Resources';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return token ? <Navigate to="/" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/language" element={<Language />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/company-settings" element={<CompanySettings />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/crm" element={<CrmDashboard initialTab="leads" />} />
        <Route path="/crm/leads" element={<CrmDashboard initialTab="leads" />} />
        <Route path="/crm/quotations" element={<CrmDashboard initialTab="quotations" />} />
        <Route path="/resources" element={<Resources />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
