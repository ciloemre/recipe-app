import { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthenticatedContentProps {
  children: ReactNode;
}

export const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({
  children,
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
