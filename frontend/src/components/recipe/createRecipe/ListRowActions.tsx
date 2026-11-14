import { ActionIcon, Group } from "@mantine/core";
import { IconHeading, IconTrash } from "@tabler/icons-react";

interface ListRowActionsProps {
  onInsertHeading: () => void;
  onRemove: () => void;
}

export function ListRowActions({
  onInsertHeading,
  onRemove,
}: ListRowActionsProps) {
  return (
    <Group gap={6} wrap="nowrap" align="center">
      <ActionIcon
        variant="light"
        color="orange"
        size="input-sm"
        aria-label="Bu satırın altına başlık ekle"
        title="Bu satırın altına başlık ekle"
        onClick={onInsertHeading}
      >
        <IconHeading size={18} />
      </ActionIcon>
      <ActionIcon
        variant="light"
        color="red"
        size="input-sm"
        aria-label="Sil"
        title="Sil"
        onClick={onRemove}
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  );
}
