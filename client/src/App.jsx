import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { getToken } from "./utils/api.js";

/**
 * Protects a route from unauthenticated access.
 *
 * @param {{children: React.ReactNode}} props - Component props containing protected children.
 * @returns {React.ReactNode} Protected children or login redirect.
 */
function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

/**
 * Root component that maps application routes to page components.
 *
 * @returns {React.ReactElement} Routed application UI.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
