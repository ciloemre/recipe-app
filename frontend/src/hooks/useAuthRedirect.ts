import { useRequireAuth } from "./useRequireAuth";

/**
 * @deprecated Prefer useRequireAuth for modal + redirect-after-login flow.
 */
export const useAuthRedirect = () => {
  const { requireAuth } = useRequireAuth();

  const redirectIfNotAuthenticated = (
    _message: string = "Bu işlem için giriş yapmalısınız."
  ) => {
    return !requireAuth();
  };

  return { redirectIfNotAuthenticated };
};
