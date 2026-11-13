import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  Group,
  Avatar,
  Text,
  Button,
  Stack,
  Box,
  Textarea,
} from "@mantine/core";
import {
  IconTrash,
  IconEdit,
  IconCheck,
  IconHeart,
  IconHeartFilled,
  IconMessageReply,
} from "@tabler/icons-react";
import { Comment, CommentReply, User } from "../../../../types/types";
import { openDeleteCommentModal } from "../../../../utils/modals";
import { notifications } from "@mantine/notifications";
import { displayPersonName } from "../../../../utils/displayName";

function ReplyComposer({
  value,
  placeholder,
  sending,
  onChange,
  onSubmit,
  onCancel,
}: {
  value: string;
  placeholder: string;
  sending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <Stack gap="xs" mt="sm">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        minRows={2}
        autosize
      />
      <Group gap="xs">
        <Button size="xs" color="orange" loading={sending} onClick={onSubmit}>
          Gönder
        </Button>
        <Button size="xs" variant="subtle" color="gray" onClick={onCancel}>
          Vazgeç
        </Button>
      </Group>
    </Stack>
  );
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onReply: (
    commentId: string,
    text: string,
    replyToUserId?: string,
    replyToReplyId?: string
  ) => Promise<boolean | void> | boolean | void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  currentUser: User | null;
  style: React.CSSProperties;
  maxHeight?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  onEdit,
  onLike,
  onReply,
  onLikeReply,
  onDeleteReply,
  currentUser,
  style,
  maxHeight = 100,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{
    id: string;
    name: string;
    replyId: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
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

  const displayName =
    typeof comment.user === "object"
      ? displayPersonName(comment.user, "Kullanıcı")
      : "Kullanıcı";
  const initial = displayName.charAt(0).toUpperCase() || "K";
  const likes = comment.likes ?? [];
  const isLiked = Boolean(
    currentUser && likes.some((id) => String(id) === currentUser._id)
  );
  const replies = [...(comment.replies ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const personName = (person: CommentReply["user"]) =>
    typeof person === "object"
      ? displayPersonName(person, "Kullanıcı")
      : "Kullanıcı";

  const personId = (person: CommentReply["user"] | Comment["user"]) =>
    typeof person === "object" ? person._id : "";

  const openReplyTo = (
    target: { id: string; name: string; replyId: string } | null
  ) => {
    setReplyTarget(target);
    setReplyOpen(true);
  };

  const closeReply = () => {
    setReplyOpen(false);
    setReplyText("");
    setReplyTarget(null);
  };

  const handleReplySubmit = async () => {
    const text = replyText.trim();
    if (!text || replySending) return;
    setReplySending(true);
    try {
      const saved = await onReply(
        comment._id,
        text,
        replyTarget?.id,
        replyTarget?.replyId
      );
      if (saved !== false) {
        closeReply();
      }
    } finally {
      setReplySending(false);
    }
  };

  return (
    <Paper
      id={`comment-${comment._id}`}
      shadow="sm"
      p="md"
      radius="md"
      style={{ ...style, transition: "all 0.3s", scrollMargin: 96 }}
    >
      <Group justify="apart" align="flex-start">
        <Group>
          <Avatar
            src={
              comment.user && typeof comment.user !== "string"
                ? comment.user.avatar || null
                : null
            }
            alt={displayName}
            color="orange"
            radius="xl"
          >
            {initial}
          </Avatar>
          <Stack gap={4}>
            <Text fw={500}>{displayName}</Text>
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
      <Group gap="xs" mt="sm">
        <Button
          variant={isLiked ? "light" : "subtle"}
          color="red"
          size="xs"
          onClick={() => onLike(comment._id)}
          leftSection={
            isLiked ? <IconHeartFilled size={14} /> : <IconHeart size={14} />
          }
        >
          {likes.length}
        </Button>
        <Button
          variant="subtle"
          color="orange"
          size="xs"
          onClick={() =>
            replyOpen && !replyTarget ? closeReply() : openReplyTo(null)
          }
          leftSection={<IconMessageReply size={14} />}
        >
          Cevapla
        </Button>
      </Group>
      {replyOpen && !replyTarget && (
        <ReplyComposer
          value={replyText}
          placeholder="Cevabını yaz..."
          sending={replySending}
          onChange={setReplyText}
          onSubmit={handleReplySubmit}
          onCancel={closeReply}
        />
      )}
      {replies.length > 0 && (
        <Stack
          gap="sm"
          mt="md"
          ml="sm"
          pl="sm"
          style={{ borderLeft: "2px solid var(--mantine-color-orange-3)" }}
        >
          {replies.map((reply) => {
            const replyName = personName(reply.user);
            const isReplyOwner =
              currentUser &&
              typeof reply.user === "object" &&
              currentUser._id === reply.user._id;
            return (
              <Box
                key={reply._id}
                id={`comment-${reply._id}`}
                style={{ scrollMargin: 96, borderRadius: 8 }}
              >
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Group gap="xs" align="flex-start" wrap="nowrap">
                    <Avatar
                      src={
                        typeof reply.user !== "string"
                          ? reply.user.avatar || null
                          : null
                      }
                      size="sm"
                      radius="xl"
                      color="orange"
                    >
                      {replyName.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <Stack gap={2}>
                    <Text size="sm" fw={600}>
                      {replyName}
                    </Text>
                    {reply.replyTo && (
                      <Text size="xs" c="orange">
                        {personName(reply.replyTo)} kişisine
                      </Text>
                    )}
                    <Text size="xs" c="dimmed">
                      {new Date(reply.date).toLocaleString()}
                    </Text>
                    </Stack>
                  </Group>
                  {isReplyOwner && (
                    <Button
                      variant="subtle"
                      color="red"
                      size="xs"
                      onClick={() =>
                        openDeleteCommentModal(reply.text, () =>
                          onDeleteReply(comment._id, reply._id)
                        )
                      }
                    >
                      Sil
                    </Button>
                  )}
                </Group>
                <Text size="sm" mt={4} style={{ wordBreak: "break-word" }}>
                  {reply.text}
                </Text>
                <Group gap={4} mt={6}>
                <Button
                  variant={
                    currentUser &&
                    (reply.likes ?? []).some((id) => String(id) === currentUser._id)
                      ? "light"
                      : "subtle"
                  }
                  color="red"
                  size="compact-xs"
                  onClick={() => onLikeReply(comment._id, reply._id)}
                  leftSection={
                    currentUser &&
                    (reply.likes ?? []).some((id) => String(id) === currentUser._id) ? (
                      <IconHeartFilled size={12} />
                    ) : (
                      <IconHeart size={12} />
                    )
                  }
                >
                  {(reply.likes ?? []).length}
                </Button>
                <Button
                  variant="subtle"
                  color="orange"
                  size="compact-xs"
                  onClick={() =>
                    openReplyTo({
                      id: personId(reply.user),
                      name: replyName,
                      replyId: reply._id,
                    })
                  }
                  leftSection={<IconMessageReply size={12} />}
                >
                  Cevapla
                </Button>
                </Group>
                {replyTarget?.replyId === reply._id && (
                  <ReplyComposer
                    value={replyText}
                    placeholder={`${replyTarget.name} kişisine cevap...`}
                    sending={replySending}
                    onChange={setReplyText}
                    onSubmit={handleReplySubmit}
                    onCancel={closeReply}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};
