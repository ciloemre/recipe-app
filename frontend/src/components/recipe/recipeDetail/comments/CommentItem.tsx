import React, { useState, useRef, useEffect } from "react";
import { Paper, Group, Avatar, Text, Button, Stack, Box } from "@mantine/core";
import { IconTrash, IconEdit, IconCheck } from "@tabler/icons-react";
import { Comment, User } from "../../../../types/types";
import { openDeleteCommentModal } from "../../../../utils/modals";
import { notifications } from "@mantine/notifications";

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  currentUser: User | null;
  style: React.CSSProperties;
  maxHeight?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  onEdit,
  currentUser,
  style,
  maxHeight = 100,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const isCommentOwner =
    currentUser &&
    typeof comment.user === "object" &&
    currentUser._id === comment.user._id;

  const handleDelete = () => {
    openDeleteCommentModal(comment.text, () => {
      onDelete(comment._id);
      showDeleteNotification();
    });
  };

  const showDeleteNotification = () => {
    notifications.show({
      title: "Yorum Silindi",
      message: "Yorum başarıyla silindi.",
      color: "teal",
      icon: <IconCheck size="1.1rem" />,
    });
  };

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > maxHeight);
    }
  }, [comment.text, maxHeight]);

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      style={{ ...style, transition: "all 0.3s" }}
    >
      <Group justify="apart" align="flex-start">
        <Group>
          <Avatar
            src={null}
            alt={
              typeof comment.user === "object"
                ? comment.user.username
                : "Kullanıcı"
            }
            color="orange"
            radius="xl"
          >
            {typeof comment.user === "object"
              ? comment.user.username.charAt(0).toUpperCase()
              : "K"}
          </Avatar>
          <Stack gap={4}>
            <Text fw={500}>
              {typeof comment.user === "object"
                ? comment.user.username
                : "Kullanıcı"}
            </Text>
            <Text size="xs" c="dimmed">
              {new Date(comment.date).toLocaleString()}
            </Text>
          </Stack>
        </Group>
        {isCommentOwner && (
          <Group>
            <Button
              variant="subtle"
              color="orange"
              size="xs"
              onClick={() => onEdit(comment._id)}
              leftSection={<IconEdit size={14} />}
            >
              Düzenle
            </Button>
            <Button
              variant="subtle"
              color="red"
              size="xs"
              onClick={handleDelete}
              leftSection={<IconTrash size={14} />}
            >
              Sil
            </Button>
          </Group>
        )}
      </Group>
      <Box
        mt="md"
        style={{
          maxHeight: expanded ? "none" : `${maxHeight}px`,
          overflow: "hidden",
          position: "relative",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <Text
          ref={textRef}
          style={{ lineHeight: 1.6, wordBreak: "break-word" }}
        >
          {comment.text}
        </Text>
        {!expanded && showButton && (
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50px",
              background: "linear-gradient(transparent, white)",
            }}
          />
        )}
      </Box>
      {showButton && (
        <Button
          variant="subtle"
          onClick={() => setExpanded(!expanded)}
          mt="xs"
          fullWidth
          size="xs"
        >
          {expanded ? "Daha az göster" : "Daha fazla göster"}
        </Button>
      )}
    </Paper>
  );
};
