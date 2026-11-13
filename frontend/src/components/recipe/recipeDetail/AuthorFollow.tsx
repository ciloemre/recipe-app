import { useEffect, useState } from "react";
import { Button, Group, Text } from "@mantine/core";
import { useAuth } from "../../../contexts/AuthContext";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { useSocket } from "../../../hooks/useSocket";
import { getFollowStatus, toggleFollow } from "../../../api/api";

interface AuthorFollowProps {
  authorId: string;
}

export function AuthorFollow({ authorId }: AuthorFollowProps) {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const { emit, on, off, subscribeConnect } = useSocket();
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSelf = Boolean(user && user._id === authorId);

  useEffect(() => {
    if (!authorId) return;
    getFollowStatus(authorId)
      .then((status) => {
        setFollowerCount(status.followerCount);
        setIsFollowing(status.isFollowing);
      })
      .catch(() => undefined);
  }, [authorId, user?._id]);

  useEffect(() => {
    if (!user?._id) return;
    const stopJoin = subscribeConnect(() => emit("authenticate", user._id));
    const handleFollow = (data: { followerCount?: number }) => {
      if (user._id !== authorId || typeof data?.followerCount !== "number") return;
      setFollowerCount(data.followerCount);
    };
    on("follow:updated", handleFollow);
    return () => {
      stopJoin();
      off("follow:updated", handleFollow);
    };
  }, [user?._id, authorId, emit, on, off, subscribeConnect]);

  const handleToggle = () => {
    requireAuth(async () => {
      setLoading(true);
      try {
        const result = await toggleFollow(authorId);
        setIsFollowing(result.isFollowing);
        setFollowerCount(result.followerCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Group gap={6} wrap="nowrap">
      <Text size="sm" c="dimmed">
        {followerCount} Takipçi
      </Text>
      {!isSelf && (
        <Button
          size="compact-sm"
          color="orange"
          variant={isFollowing ? "outline" : "filled"}
          loading={loading}
          onClick={handleToggle}
        >
          {isFollowing ? "Takip Ediliyor" : "Takip Et"}
        </Button>
      )}
    </Group>
  );
}
