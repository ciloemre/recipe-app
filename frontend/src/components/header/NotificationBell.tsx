import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBell } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "./HeaderSearch.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import {
  AppNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/api";
import { formatNotificationMessage } from "../../utils/formatNotificationMessage";
import { formatLocaleNumber } from "../../utils/localeFormat";

function senderName(item: AppNotification, fallback: string) {
  const name = item.sender?.name?.trim();
  if (name) return name;
  const username = item.sender?.username?.trim();
  if (username) return username;
  return fallback;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(value: string, labels: {
  justNow: string;
  minutesAgo: (count: number) => string;
  hoursAgo: (count: number) => string;
}) {
  const diff = Date.now() - new Date(value).getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (Number.isNaN(diff) || diff < minute) return labels.justNow;
  if (diff < hour) return labels.minutesAgo(Math.floor(diff / minute));
  if (diff < day) return labels.hoursAgo(Math.floor(diff / hour));
  return new Date(value).toLocaleDateString();
}

export function NotificationBell() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "tr";
  const { user } = useAuth();
  const navigate = useNavigate();
  const { emit, on, off, subscribeConnect } = useSocket();
  const [opened, setOpened] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const itemsRef = useRef<AppNotification[]>([]);
  itemsRef.current = items;

  const load = () => {
    getNotifications()
      .then((data) => {
        setItems(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    if (!user) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    load();
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    const join = () => {
      emit("authenticate", user._id);
      emit("joinUserRoom", user._id);
      load();
    };
    const stopJoin = subscribeConnect(join);

    const handleNew = (item: AppNotification) => {
      if (!item?._id) return;
      const prev = itemsRef.current;
      const previous = prev.find((entry) => entry._id === item._id);
      const next = [
        item,
        ...prev.filter((entry) => entry._id !== item._id),
      ].slice(0, 20);
      const shouldCount =
        (!previous && !item.isRead) || Boolean(previous?.isRead && !item.isRead);
      itemsRef.current = next;
      setItems(next);
      if (shouldCount) setUnreadCount((count) => count + 1);
      const body = formatNotificationMessage(item, t);
      notifications.show({
        title: t("notifications.titleOne"),
        message: `${senderName(item, t("notifications.aUser"))} ${body}`,
        color: "orange",
        icon: <IconBell size="1.1rem" />,
      });
    };

    on("notification:new", handleNew);
    return () => {
      stopJoin();
      off("notification:new", handleNew);
    };
  }, [user?._id, emit, on, off, subscribeConnect]);

  useEffect(() => {
    if (opened) load();
  }, [opened]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => load();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [user]);

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  };

  const handleOpen = async (item: AppNotification) => {
    if (!item.isRead) {
      await markNotificationRead(item._id);
      setItems((prev) =>
        prev.map((entry) =>
          entry._id === item._id ? { ...entry, isRead: true } : entry
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    setMenuKey((key) => key + 1);
    if (item.recipe?._id) {
      const commentTypes = [
        "RECIPE_COMMENT",
        "COMMENT_LIKE",
        "COMMENT_REPLY",
        "REPLY_LIKE",
      ];
      const anchorId =
        item.type === "COMMENT_REPLY" || item.type === "REPLY_LIKE"
          ? item.targetId || item.commentId
          : item.commentId;
      const hash =
        anchorId && commentTypes.includes(item.type)
          ? `#comment-${anchorId}`
          : "";
      navigate(`/recipe/${item.recipe._id}${hash}`, {
        state: { highlightAt: Date.now() },
      });
    }
  };

  return (
    <Popover
      key={menuKey}
      width={320}
      position="bottom-end"
      offset={8}
      shadow="md"
      onChange={setOpened}
      withinPortal
    >
      <Popover.Target>
        <UnstyledButton
          className={classes.bell}
          data-unread={unreadCount > 0 || undefined}
          title={t("notifications.title")}
          aria-label={
            unreadCount > 0
              ? `${t("notifications.title")}, ${t("notifications.unreadCount", { count: unreadCount })}`
              : t("notifications.title")
          }
        >
          <IconBell size={18} stroke={1.7} />
          <span className={classes.linkLabel}>{t("notifications.titleOne")}</span>
          {unreadCount > 0 && (
            <span className={classes.count}>
              {unreadCount > 9
                ? `${formatLocaleNumber(9, lang)}+`
                : formatLocaleNumber(unreadCount, lang)}
            </span>
          )}
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown className={classes.dropdown} p="sm">
        <Group
          className={classes.dropdownHeader}
          justify="space-between"
          mb="xs"
          wrap="nowrap"
        >
          <Text fw={700} style={{ flexShrink: 0 }}>
            {t("notifications.title")}
          </Text>
          <Button
            variant="subtle"
            color="orange"
            size="compact-xs"
            onClick={handleReadAll}
            disabled={unreadCount === 0}
            style={{ flexShrink: 1, whiteSpace: "normal", height: "auto" }}
          >
            {t("notifications.markAllRead")}
          </Button>
        </Group>
        <ScrollArea.Autosize mah={400} type="auto" offsetScrollbars>
          {items.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="lg">
              {t("notifications.empty")}
            </Text>
          ) : (
            <Stack gap={4}>
              {items.map((item) => {
                const body = formatNotificationMessage(item, t);
                return (
                  <UnstyledButton
                    key={item._id}
                    onClick={() => handleOpen(item)}
                    className={classes.notificationItem}
                    style={{
                      background: item.isRead
                        ? "transparent"
                        : "var(--mantine-color-orange-light)",
                    }}
                  >
                    <Group
                      className={classes.notificationRow}
                      align="flex-start"
                      wrap="nowrap"
                      gap="sm"
                    >
                      <Avatar
                        src={item.sender?.avatar || null}
                        color="orange"
                        radius="xl"
                        size="sm"
                        style={{ flexShrink: 0 }}
                      >
                        {initials(senderName(item, t("notifications.aUser")))}
                      </Avatar>
                      <Box className={classes.notificationBody}>
                        <Text size="sm" className={classes.notificationText}>
                          <Text span fw={700}>
                            {senderName(item, t("notifications.aUser"))}
                          </Text>{" "}
                          {body}
                        </Text>
                        {item.recipe?.title && (
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {item.recipe.title}
                          </Text>
                        )}
                        <Text size="xs" c="dimmed">
                        {relativeTime(item.createdAt, {
                          justNow: t("notifications.justNow"),
                          minutesAgo: (count) =>
                            t("notifications.minutesAgo", {
                              count: formatLocaleNumber(count, lang),
                            }),
                          hoursAgo: (count) =>
                            t("notifications.hoursAgo", {
                              count: formatLocaleNumber(count, lang),
                            }),
                        })}
                        </Text>
                      </Box>
                      {!item.isRead && (
                        <Box className={classes.unreadDot} />
                      )}
                    </Group>
                  </UnstyledButton>
                );
              })}
            </Stack>
          )}
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
