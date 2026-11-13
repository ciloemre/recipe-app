import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Text } from "@mantine/core";
import { useAuth } from "../contexts/AuthContext";
import { REDIRECT_AFTER_LOGIN_KEY } from "../utils/welcome";

export const REDIRECT_KEY = REDIRECT_AFTER_LOGIN_KEY;

export function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (action?: () => void | Promise<void>): boolean => {
      if (user) {
        void action?.();
        return true;
      }

      sessionStorage.setItem(REDIRECT_KEY, location.pathname + location.search);

      notifications.show({
        title: "Giriş gerekli",
        message: "Bu işlemi gerçekleştirmek için lütfen giriş yapın.",
        color: "orange",
      });

      modals.openConfirmModal({
        title: "Giriş gerekli",
        centered: true,
        children: (
          <Text size="sm">
            Bu işlemi gerçekleştirmek için lütfen giriş yapın.
          </Text>
        ),
        labels: { confirm: "Giriş Yap", cancel: "Vazgeç" },
        confirmProps: { color: "orange" },
        onConfirm: () => navigate("/login"),
      });

      return false;
    },
    [user, location.pathname, location.search, navigate]
  );

  return { requireAuth, isAuthenticated: Boolean(user) };
}
