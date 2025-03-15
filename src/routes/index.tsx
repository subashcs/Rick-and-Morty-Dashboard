import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import DashboardLayout from '../components/DashboardLayout';
import Characters from '../pages/Characters';
import Episodes from '../pages/Episodes';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/characters" replace />} />
        <Route path="characters" element={<Characters />} />
        <Route path="episodes" element={<Episodes />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
