import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminLayout from './components/layout/AdminLayout'
import Campers from './pages/admin/Campers'
import Periods from './pages/admin/Periods'
import Registrations from './pages/admin/Registrations'
import Payments from './pages/admin/Payments'
import Groups from './pages/admin/Groups'
import Staff from './pages/admin/Staff'
import Medical from './pages/admin/Medical'
import CheckIn from './pages/admin/CheckIn'
import AnalyticsDashboard from './pages/admin/Analytics'
import ParentPortal from './pages/parent/ParentPortal'

import FoodHaccp from './pages/admin/FoodHaccp'
import Pricing from './pages/admin/Pricing'
import Incidents from './pages/admin/Incidents'
import FireProtection from './pages/admin/FireProtection'
import Manual from './pages/admin/Manual'

import CalendarView from './pages/admin/CalendarView'
import CabinAssignment from './pages/admin/CabinAssignment'
import MedicalDashboard from './pages/admin/MedicalDashboard'

// Simple protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="flex h-screen items-center justify-center">Unauthorized Access</div>;
  }
  
  return children;
};

import Dashboard from './pages/admin/Dashboard'

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Admin/Staff Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin', 'staff']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="campers" element={<Campers />} />
        <Route path="periods" element={<Periods />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="payments" element={<Payments />} />
        <Route path="groups" element={<Groups />} />
        <Route path="staff" element={<Staff />} />
        <Route path="medical" element={<Medical />} />
        <Route path="checkin" element={<CheckIn />} />
        
        {/* New Modules */}
        <Route path="food" element={<FoodHaccp />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="fire-protection" element={<FireProtection />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="manual" element={<Manual />} />

        {/* Feature Expansions */}
        <Route path="calendar" element={<CalendarView />} />
        <Route path="assignment" element={<CabinAssignment />} />
        <Route path="medical-dash" element={<MedicalDashboard />} />
      </Route>
      
      {/* Protected Parent Routes */}
      <Route path="/parent/*" element={
        <ProtectedRoute allowedRoles={['parent']}>
          <ParentPortal />
        </ProtectedRoute>
      } />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
