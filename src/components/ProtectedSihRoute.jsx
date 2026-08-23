import { Navigate, useLocation } from "react-router-dom";
import { useSihAuth } from "../context/SihAuthContext";

function ProtectedSihRoute({ children }) {
  const location = useLocation();

  const {
    isAuthenticated,
    loading,
  } = useSihAuth();

  // Wait until /api/auth/me finishes
  // checking the authentication cookie.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </div>
    );
  }

  // Not logged in → send to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/sih/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedSihRoute;