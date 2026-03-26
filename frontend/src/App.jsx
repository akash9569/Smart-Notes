import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import { HabitsProvider } from './context/HabitsContext';
import { ExpensesProvider } from './context/ExpensesContext';
import { SettingsProvider } from './context/SettingsContext';
import NotificationManager from './components/NotificationManager';
import { CommandPalette } from './components/CommandPalette';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // ✅ ADD THIS

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    if (location.pathname === '/' || location.pathname === '') {
      return <Landing />;
    }
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotesProvider>
            <TasksProvider>
              <HabitsProvider>
                <ExpensesProvider>
                  <SettingsProvider>
                    <CommandPalette />
                    <NotificationManager />
                    <Toaster position="bottom-right" />
                    <Routes>
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/cookies" element={<CookiePolicy />} />
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </SettingsProvider>
                </ExpensesProvider>
              </HabitsProvider>
            </TasksProvider>
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
