import React, { useMemo } from "react";
import { Transition, Stack } from "@mantine/core";
import { Comment, User } from "../../../../types/types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
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
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onDelete,
  onEdit,
  onLike,
  onReply,
  onLikeReply,
  onDeleteReply,
  currentUser,
}) => {
  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [comments]);

  return (
    <Stack gap="md">
      {sortedComments.map((comment) => (
        <Transition
          key={comment._id}
          mounted={true}
          transition="fade"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <CommentItem
              comment={comment}
              onDelete={onDelete}
              onEdit={onEdit}
              onLike={onLike}
              onReply={onReply}
              onLikeReply={onLikeReply}
              onDeleteReply={onDeleteReply}
              currentUser={currentUser}
              style={styles}
            />
          )}
        </Transition>
      ))}
    </Stack>
  );
};
