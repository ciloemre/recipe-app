import { Group, ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import CustomTitle from "../../../components/atoms/CustomTitle";

interface PageHeaderProps {
  title: string;
  backLink: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <Group p="sm" mb="xl">
      <ActionIcon
        variant="subtle"
        size="md"
        onClick={() => navigate("/recipes")}
        mb="md"
      >
        <IconArrowLeft size={32} />
      </ActionIcon>
      <CustomTitle level={1}>{title}</CustomTitle>
    </Group>
  );
}

export default PageHeader;
