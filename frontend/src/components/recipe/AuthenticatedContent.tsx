import { ReactNode, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { Center, Loader } from "@mantine/core";

interface AuthenticatedContentProps {
  children: ReactNode;
}

export const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const { requireAuth } = useRequireAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      requireAuth();
    }
  }, [isLoading, user, requireAuth]);

  if (isLoading) {
    return (
      <Center h="40vh">
        <Loader color="orange" />
      </Center>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
