import React, { useState } from "react";
import { Textarea, Group } from "@mantine/core";
import { Comment } from "../../../../types/types";
import { CustomButton } from "../../../atoms/CustomButton";
import { openCancelConfirmModal } from "../../../../utils/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

interface EditCommentFormProps {
  comment: Comment;
  onSubmit: (editedContent: string) => void;
  onCancel: () => void;
}

export const EditCommentForm: React.FC<EditCommentFormProps> = ({
  comment,
  onSubmit,
  onCancel,
}) => {
  const [editedContent, setEditedContent] = useState(comment.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedContent);
    showNotification("success", "Yorum başarıyla düzenlendi");
  };

  const handleCancelClick = () => {
    openCancelConfirmModal("Düzenleme", onCancel);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    notifications.show({
      title: type === "success" ? "Başarılı" : "Dikkat",
      message,
      color: type === "success" ? "teal" : "red",
      icon:
        type === "success" ? (
          <IconCheck size="1.1rem" />
        ) : (
          <IconX size="1.1rem" />
        ),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.currentTarget.value)}
        minRows={2}
        mb="sm"
      />
      <Group justify="flex-end">
        <CustomButton variant="outline" onClick={handleCancelClick}>
          İptal
        </CustomButton>

        <CustomButton type="submit">Kaydet</CustomButton>
      </Group>
    </form>
  );
};
