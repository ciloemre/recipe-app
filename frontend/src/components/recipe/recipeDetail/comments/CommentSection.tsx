import { useState, forwardRef, useEffect } from "react";
import { Box, Title, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  addComment,
  addCommentReply,
  deleteComment,
  deleteCommentReply,
  editComment,
  toggleCommentLike,
  toggleReplyLike,
} from "../../../../api/api";
import { Comment, Recipe } from "../../../../types/types";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { EditCommentForm } from "./EditCommentForm";
import { useSocket } from "../../../../hooks/useSocket";
import { useRequireAuth } from "../../../../hooks/useRequireAuth";

interface CommentSectionProps {
  comments: Comment[];
  recipeId: string;
  refreshRecipe: () => Promise<void>;
  onRecipeChange?: (recipe: Recipe) => void;
}

export const CommentSection = forwardRef<HTMLDivElement, CommentSectionProps>(
  ({ comments, recipeId, refreshRecipe, onRecipeChange }, ref) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { requireAuth } = useRequireAuth();
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
      null
    );
    const { on, off, emit } = useSocket();

    const showRecipe = async (next?: Recipe) => {
      if (next?._id && Array.isArray(next.comments)) {
        onRecipeChange?.(next);
        return;
      }
      await refreshRecipe();
    };

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
      if (!newComment) return;

      const allowed = requireAuth();
      if (!allowed || !user) return;

      try {
        const updated = await addComment(recipeId, newComment);
        await showRecipe(updated);
        emit("commentAdded", { recipeId, comment: newComment });
      } catch (error) {
        console.error("Yorum ekleme hatası:", error);
      }
    };

    const handleCommentDelete = async (commentId: string) => {
      const allowed = requireAuth();
      if (!allowed) return;

      try {
        const updated = await deleteComment(recipeId, commentId);
        await showRecipe(updated);
        emit("commentDeleted", { recipeId, commentId });
      } catch (error) {
        console.error("Yorum silme hatası:", error);
      }
    };

    const handleCommentEdit = async (
      commentId: string,
      editedContent: string
    ) => {
      const allowed = requireAuth();
      if (!allowed) return;

      try {
        const updated = await editComment(recipeId, commentId, editedContent);
        await showRecipe(updated);
        emit("commentEdited", { recipeId, commentId, editedContent });
        setEditingCommentId(null);
      } catch (error) {
        console.error("Yorum düzenleme hatası:", error);
      }
    };

    const handleCommentLike = async (commentId: string) => {
      const allowed = requireAuth();
      if (!allowed) return;

      try {
        const updated = await toggleCommentLike(recipeId, commentId);
        await showRecipe(updated);
      } catch (error) {
        console.error("Yorum beğenme hatası:", error);
      }
    };

    const handleCommentReply = async (
      commentId: string,
      text: string,
      replyToUserId?: string,
      replyToReplyId?: string
    ) => {
      const allowed = requireAuth();
      if (!allowed) return false;

      try {
        const updated = await addCommentReply(
          recipeId,
          commentId,
          text,
          replyToUserId,
          replyToReplyId
        );
        await showRecipe(updated);
        return true;
      } catch (error) {
        console.error("Yorum cevaplama hatası:", error);
        return false;
      }
    };

    const handleReplyLike = async (commentId: string, replyId: string) => {
      const allowed = requireAuth();
      if (!allowed) return;

      try {
        const updated = await toggleReplyLike(recipeId, commentId, replyId);
        await showRecipe(updated);
      } catch (error) {
        console.error("Cevap beğenme hatası:", error);
      }
    };

    const handleReplyDelete = async (commentId: string, replyId: string) => {
      const allowed = requireAuth();
      if (!allowed) return;

      try {
        const updated = await deleteCommentReply(recipeId, commentId, replyId);
        await showRecipe(updated);
      } catch (error) {
        console.error("Cevap silme hatası:", error);
      }
    };

    return (
      <Box ref={ref} mt="xl">
        <Title order={2} mb="lg" c="orange">
          {t("comments.title")}
        </Title>
        <Stack gap="xl">
          <CommentForm onSubmit={handleCommentSubmit} />
          <CommentList
            comments={comments}
            onDelete={handleCommentDelete}
            onEdit={(commentId: string) => setEditingCommentId(commentId)}
            onLike={handleCommentLike}
            onReply={handleCommentReply}
            onLikeReply={handleReplyLike}
            onDeleteReply={handleReplyDelete}
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

CommentSection.displayName = "CommentSection";
