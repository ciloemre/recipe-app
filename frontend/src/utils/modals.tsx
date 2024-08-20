import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export const openConfirmModal = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmLabel: string = "Onayla",
  cancelLabel: string = "İptal"
) => {
  modals.openConfirmModal({
    title,
    centered: true,
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    cancelProps: {
      color: "orange",
      variant: "outline",
      radius: "md",
      size: "sm",
    },
    confirmProps: {
      color: "red",
      variant: "filled",
      radius: "md",
      size: "sm",
    },
    onCancel,
    onConfirm,
  });
};

export const openDeleteConfirmModal = (
  itemName: string,
  onConfirm: () => void
) => {
  openConfirmModal(
    `${itemName} Sil`,
    `Bu ${itemName.toLowerCase()}i silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
    onConfirm,
    () => console.log(`${itemName} silme işlemi iptal edildi`),
    "Evet, sil",
    "Hayır, iptal et"
  );
};

export const openCancelConfirmModal = (
  action: string,
  onConfirm: () => void
) => {
  openConfirmModal(
    `${action} İptal Et`,
    `${action} işlemini iptal etmek istediğinizden emin misiniz? Kaydedilmemiş tüm değişiklikler kaybolacaktır.`,
    onConfirm,
    () => console.log(`${action} işlemine devam ediliyor`),
    "Evet, çık",
    "Hayır, devam et"
  );
};

export const openDeleteCommentModal = (
  commentText: string,
  onConfirm: () => void
) => {
  const truncatedComment =
    commentText.length > 100
      ? commentText.substring(0, 100) + "..."
      : commentText;

  openConfirmModal(
    "Yorumu Sil",
    `Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.\n\nSilinecek yorum:\n"${truncatedComment}"`,
    onConfirm,
    () => console.log("Yorum silme işlemi iptal edildi"),
    "Evet, sil",
    "Hayır, iptal et"
  );
};
