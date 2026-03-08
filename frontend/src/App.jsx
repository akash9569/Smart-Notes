import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ContactUs from './pages/ContactUs';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import { HabitsProvider } from './context/HabitsContext';
import { ExpensesProvider } from './context/ExpensesContext';
import NotificationManager from './components/NotificationManager';
import { CommandPalette } from './components/CommandPalette';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    if (location.pathname === '/' || location.pathname === '') {
      return <Landing />;
    }
    return <Navigate to="/login" />;
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
                  <CommandPalette />
                  <NotificationManager />
                  <Toaster position="bottom-right" />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
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
