import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Signin from './components/Signin';
import Preferences from './components/Preferences';
import SavedNews from './components/SavedNews';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return !isAuthenticated ? children : <Navigate to="/preferences" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />

        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Signin onLogin={handleLogin} />
            </PublicRoute>
          }
        />

        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <Preferences onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedNews onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
