import { ActionIcon, Group, SimpleGrid } from "@mantine/core";
import { IconHeading, IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../../atoms/CustomButton";

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

export function ListAddButtons({
  addLabel,
  onAdd,
  onAddHeading,
}: {
  addLabel: string;
  onAdd: () => void;
  onAddHeading: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="sm">
      <CustomButton fullWidth onClick={onAdd}>
        <IconPlus size={16} style={{ marginInlineEnd: 6 }} />
        {addLabel}
      </CustomButton>
      <CustomButton fullWidth variant="light" onClick={onAddHeading}>
        <IconHeading size={16} style={{ marginInlineEnd: 6 }} />
        {t("create.addHeading")}
      </CustomButton>
    </SimpleGrid>
  );
}
