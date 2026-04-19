import { Navigate, useLocation } from "react-router-dom";

// A simple mock authentication service
export const authService = {
  isAuthenticated: () => sessionStorage.getItem("svk_admin_auth") === "true",
  login: () => sessionStorage.setItem("svk_admin_auth", "true"),
  logout: () => sessionStorage.removeItem("svk_admin_auth")
};

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
