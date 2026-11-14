import React, { useState } from "react";
import { Textarea, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Comment } from "../../../../types/types";
import { CustomButton } from "../../../atoms/CustomButton";
import { openCancelConfirmModal } from "../../../../utils/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

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
  const { t } = useTranslation();
  const [editedContent, setEditedContent] = useState(comment.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedContent);
    notifications.show({
      title: t("common.success"),
      message: t("detail.commentUpdated"),
      color: "teal",
      icon: <IconCheck size="1.1rem" />,
    });
  };

  const handleCancelClick = () => {
    openCancelConfirmModal(t("detail.edit"), onCancel);
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
          {t("detail.cancel")}
        </CustomButton>

        <CustomButton type="submit">{t("common.save")}</CustomButton>
      </Group>
    </form>
  );
};
