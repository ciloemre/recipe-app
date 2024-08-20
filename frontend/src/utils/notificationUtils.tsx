// utils/notificationUtils.ts
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const showNotification = (
  type: "success" | "error",
  title: string,
  message: string
) => {
  notifications.show({
    title,
    message,
    color: type === "success" ? "green" : "red",
    icon:
      type === "success" ? (
        <IconCheck size="1.1rem" />
      ) : (
        <IconX size="1.1rem" />
      ),
  });
};
