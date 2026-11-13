import { Navigate, useLocation } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "../../contexts/AuthContext";
import { REDIRECT_KEY } from "../../hooks/useRequireAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route-level guard for write/profile surfaces.
 * Public browse routes should NOT use this.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="orange" />
      </Center>
    );
  }

  if (!user) {
    sessionStorage.setItem(
      REDIRECT_KEY,
      location.pathname + location.search
    );
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
