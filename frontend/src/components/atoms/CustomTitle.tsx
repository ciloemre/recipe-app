import React from "react";
import { Title, TitleProps } from "@mantine/core";

interface CustomTitleProps extends TitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  mb?: number | string;
  children: React.ReactNode;
}

const CustomTitle: React.FC<CustomTitleProps> = ({
  level = 3,
  mb = "sm",
  children,
  ...rest
}) => {
  return (
    <Title order={level} mb={mb} {...rest}>
      {children}
    </Title>
  );
};

export default CustomTitle;
