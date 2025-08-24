
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Profile } from './pages/Profile';
import Requests from './pages/Requests';
import ProcurementRequests from './pages/ProcurementRequests';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Offers from './pages/Offers';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminProjects from './pages/admin/AdminProjects';
import ProtectedRoute from './components/ProtectedRoute';
import { QueryClient } from './integrations/react-query/client';
import { RouteAwareThemeProvider } from './components/RouteAwareThemeProvider';
import { Toaster } from "@/components/ui/toaster"
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import PublicRoute from './components/PublicRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ActivityFeed from './pages/ActivityFeed';
import AdminOffers from './pages/admin/AdminOffers';
import CreateProcurementRequest from "@/pages/CreateProcurementRequest";
import CreateRequest from "@/pages/CreateRequest";

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <LanguageProvider>
          <RouteAwareThemeProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                <Route path="/procurement-requests" element={<ProtectedRoute><ProcurementRequests /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
                <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
                <Route path="/activity" element={<ProtectedRoute><ActivityFeed /></ProtectedRoute>} />
                <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/requests" element={<ProtectedRoute><AdminRequests /></ProtectedRoute>} />
                <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
                <Route path="/admin/offers" element={<ProtectedRoute><AdminOffers /></ProtectedRoute>} />
                
                {/* Add new routes for form pages */}
                <Route path="/requests/create" element={
                  <ProtectedRoute>
                    <CreateRequest />
                  </ProtectedRoute>
                } />
                <Route path="/procurement-requests/create" element={
                  <ProtectedRoute>
                    <CreateProcurementRequest />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route for 404 Not Found */}
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </Router>
            <Toaster />
          </RouteAwareThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
