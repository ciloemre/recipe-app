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

function senderName(item: AppNotification) {
  const name = item.sender?.name?.trim();
  if (name) return name;
  const username = item.sender?.username?.trim();
  if (username) return username;
  return "Bir kullanıcı";
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (Number.isNaN(diff) || diff < minute) return "Az önce";
  if (diff < hour) return `${Math.floor(diff / minute)} dk önce`;
  if (diff < day) return `${Math.floor(diff / hour)} sa önce`;
  return new Date(value).toLocaleDateString("tr-TR");
}

export function NotificationBell() {
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
      const lead = item.message.startsWith('"') ? ", " : " ";
      notifications.show({
        title: "Bildirim",
        message: `${senderName(item)}${lead}${item.message}`,
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
      width={300}
      position="bottom-end"
      offset={8}
      shadow="md"
      onChange={setOpened}
    >
      <Popover.Target>
        <UnstyledButton
          className={classes.bell}
          data-unread={unreadCount > 0 || undefined}
          title="Bildirimler"
          aria-label={
            unreadCount > 0
              ? `Bildirimler, ${unreadCount} okunmamış`
              : "Bildirimler"
          }
        >
          <IconBell size={18} stroke={1.7} />
          <span className={classes.linkLabel}>Bildirim</span>
          {unreadCount > 0 && (
            <span className={classes.count}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown className={classes.dropdown} p="sm">
        <Group justify="space-between" mb="xs" wrap="nowrap">
          <Text fw={700}>Bildirimler</Text>
          <Button
            variant="subtle"
            color="orange"
            size="compact-xs"
            onClick={handleReadAll}
            disabled={unreadCount === 0}
          >
            Tümünü Okundu İşaretle
          </Button>
        </Group>
        <ScrollArea.Autosize mah={400} type="auto">
          {items.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="lg">
              Henüz bildirim yok
            </Text>
          ) : (
            <Stack gap={4}>
              {items.map((item) => (
                <UnstyledButton
                  key={item._id}
                  onClick={() => handleOpen(item)}
                  style={{
                    borderRadius: 8,
                    padding: "8px 10px",
                    background: item.isRead
                      ? "transparent"
                      : "var(--mantine-color-orange-light)",
                  }}
                >
                  <Group align="flex-start" wrap="nowrap" gap="sm">
                    <Avatar
                      src={item.sender?.avatar || null}
                      color="orange"
                      radius="xl"
                      size="sm"
                    >
                      {initials(senderName(item))}
                    </Avatar>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" style={{ whiteSpace: "normal" }}>
                        <Text span fw={700}>
                          {senderName(item)}
                        </Text>
                        {item.message.startsWith('"') ? ", " : " "}
                        {item.message}
                      </Text>
                      {item.recipe?.title && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {item.recipe.title}
                        </Text>
                      )}
                      <Text size="xs" c="dimmed">
                        {relativeTime(item.createdAt)}
                      </Text>
                    </Box>
                    {!item.isRead && (
                      <Box
                        w={8}
                        h={8}
                        mt={6}
                        style={{
                          borderRadius: 99,
                          background: "var(--mantine-color-red-6)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          )}
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
