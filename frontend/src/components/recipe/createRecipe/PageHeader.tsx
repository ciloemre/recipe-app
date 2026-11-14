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
    <Group mb={{ base: "md", sm: "xl" }} align="center">
      <ActionIcon
        variant="subtle"
        size="md"
        onClick={() => navigate("/recipes")}
      >
        <IconArrowLeft size={32} />
      </ActionIcon>
      <CustomTitle level={1}>{title}</CustomTitle>
    </Group>
  );
}

export default PageHeader;
