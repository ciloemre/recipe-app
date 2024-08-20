import { useState, forwardRef, useEffect } from "react";
import { Box, Title, Stack } from "@mantine/core";
import { useAuth } from "../../../../contexts/AuthContext";
import { addComment, deleteComment, editComment } from "../../../../api/api";
import { Comment } from "../../../../types/types";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { EditCommentForm } from "./EditCommentForm";
import { useSocket } from "../../../../hooks/useSocket";

interface CommentSectionProps {
  comments: Comment[];
  recipeId: string;
  refreshRecipe: () => Promise<void>;
}

export const CommentSection = forwardRef<HTMLDivElement, CommentSectionProps>(
  ({ comments, recipeId, refreshRecipe }, ref) => {
    const { user } = useAuth();
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
      null
    );
    const { on, off, emit } = useSocket();

    useEffect(() => {
      const handleCommentUpdate = () => {
        refreshRecipe();
      };

      on("commentAdded", handleCommentUpdate);
      on("commentDeleted", handleCommentUpdate);
      on("commentEdited", handleCommentUpdate);

      return () => {
        off("commentAdded", handleCommentUpdate);
        off("commentDeleted", handleCommentUpdate);
        off("commentEdited", handleCommentUpdate);
      };
    }, [on, off, refreshRecipe]);

    const handleCommentSubmit = async (newComment: string) => {
      if (user && newComment) {
        try {
          await addComment(recipeId, newComment);
          emit("commentAdded", { recipeId, comment: newComment });
        } catch (error) {
          console.error("Yorum ekleme hatası:", error);
        }
      }
    };

    const handleCommentDelete = async (commentId: string) => {
      try {
        await deleteComment(recipeId, commentId);
        emit("commentDeleted", { recipeId, commentId });
      } catch (error) {
        console.error("Yorum silme hatası:", error);
      }
    };

    const handleCommentEdit = async (
      commentId: string,
      editedContent: string
    ) => {
      try {
        await editComment(recipeId, commentId, editedContent);
        emit("commentEdited", { recipeId, commentId, editedContent });
        setEditingCommentId(null);
      } catch (error) {
        console.error("Yorum düzenleme hatası:", error);
      }
    };

    return (
      <Box ref={ref} mt="xl">
        <Title order={2} mb="lg" c="orange">
          Yorumlar
        </Title>
        <Stack gap="xl">
          <CommentForm onSubmit={handleCommentSubmit} />
          <CommentList
            comments={comments}
            onDelete={handleCommentDelete}
            onEdit={(commentId: string) => setEditingCommentId(commentId)}
            currentUser={user}
          />
          {editingCommentId && (
            <EditCommentForm
              comment={
                comments.find((c: Comment) => c._id === editingCommentId)!
              }
              onSubmit={(editedContent: string) =>
                handleCommentEdit(editingCommentId, editedContent)
              }
              onCancel={() => setEditingCommentId(null)}
            />
          )}
        </Stack>
      </Box>
    );
  }
);
