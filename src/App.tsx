import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { Layout } from '@/components/layout/Layout';

// Import all pages
import { DashboardPage } from '@/pages/DashboardPage';
import { AssociationsPage } from '@/pages/AssociationsPage';
import { BlocksPage } from '@/pages/BlocksPage';
import { ApartmentsPage } from '@/pages/ApartmentsPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { AnnouncementsPage } from '@/pages/AnnouncementsPage';
import { RepairRequestsPage } from '@/pages/RepairRequestsPage';
import { MeterReadingsPage } from '@/pages/MeterReadingsPage';
import { UsersPage } from '@/pages/UsersPage';
import { MyApartmentPage } from '@/pages/MyApartmentPage';
import { MyExpensesPage } from '@/pages/MyExpensesPage';
import { MyPaymentsPage } from '@/pages/MyPaymentsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // TODO: sa repun asta fara comentari pentru securitate
  // if (!user) {
  //   return <AuthContainer />;
  // }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Association Routes */}
            <Route
              path="/associations"
              element={
                <ProtectedRoute>
                  <AssociationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blocks"
              element={
                <ProtectedRoute>
                  <BlocksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* Block Admin Routes */}
            <Route
              path="/apartments"
              element={
                <ProtectedRoute>
                  <ApartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meter-readings"
              element={
                <ProtectedRoute>
                  <MeterReadingsPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes */}
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repair-requests"
              element={
                <ProtectedRoute>
                  <RepairRequestsPage />
                </ProtectedRoute>
              }
            />

            {/* Tenant Routes */}
            <Route
              path="/my-apartment"
              element={
                <ProtectedRoute>
                  <MyApartmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-expenses"
              element={
                <ProtectedRoute>
                  <MyExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-payments"
              element={
                <ProtectedRoute>
                  <MyPaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-repairs"
              element={
                <ProtectedRoute>
                  <RepairRequestsPage />
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;