import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import CampaignDashboard from './component/campaign/CampaignDashboard';
import CampaignForm from './component/campaign/CampaignForm';
import Login from './component/Login';
import Register from './component/Register';  // Import Register component
import CampaignMetrics from './component/campaign/CampaignMatrix';


// PrivateRoute component ensures that only authenticated users can access certain routes
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// RedirectRoute component to prevent logged-in users from accessing login or register pages
const RedirectRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children; // Redirect if already logged in
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <RedirectRoute>
                <Login />
              </RedirectRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectRoute>
                <Register />
              </RedirectRoute>
            }
          />

          {/* Protected Routes wrapped with PrivateRoute */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CampaignDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns/new"
            element={
              <PrivateRoute>
                <CampaignForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns/:id/edit"
            element={
              <PrivateRoute>
                <CampaignForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns/:id/metrics"
            element={
              <PrivateRoute>
                <CampaignMetrics/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
