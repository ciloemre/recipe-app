import React, { useState } from "react";
import { Paper, Button } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { CustomTextarea } from "../../../atoms/CustomTextarea";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment("");
    }
  };

  return (
    <Paper shadow="sm" p={{ base: "sm", sm: "lg" }} withBorder mb="xl">
      <form onSubmit={handleSubmit}>
        <CustomTextarea
          label={t("comments.yourComment")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          mb="md"
          placeholder={t("comments.placeholder")}
        />
        <Button
          type="submit"
          leftSection={<IconMessageCircle size={16} />}
          color="orange"
        >
          {t("comments.send")}
        </Button>
      </form>
    </Paper>
  );
};
