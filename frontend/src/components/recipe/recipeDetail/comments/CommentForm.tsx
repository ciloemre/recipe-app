import React, { useState } from "react";
import { Paper, Button } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { CustomTextarea } from "../../../atoms/CustomTextarea";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment("");
    }
  };

  return (
    <Paper shadow="sm" p="lg" withBorder mb="xl">
      <form onSubmit={handleSubmit}>
        <CustomTextarea
          label="Yorumunuz"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          mb="md"
          placeholder="Düşüncelerinizi paylaşın..."
        />
        <Button
          type="submit"
          leftSection={<IconMessageCircle size={16} />}
          color="orange"
        >
          Gönder
        </Button>
      </form>
    </Paper>
  );
};
