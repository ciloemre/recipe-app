import React, { useMemo } from "react";
import { Transition, Stack } from "@mantine/core";
import { Comment, User } from "../../../../types/types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  currentUser: User | null;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onDelete,
  onEdit,
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
              currentUser={currentUser}
              style={styles}
            />
          )}
        </Transition>
      ))}
    </Stack>
  );
};
