import React from "react";
import { Button, ButtonProps } from "@mantine/core";

interface CustomButtonProps extends Omit<ButtonProps, "onClick"> {
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  title?: string;
}

export function CustomButton({
  children,
  icon,
  onClick,
  type = "button",
  ...props
}: CustomButtonProps) {
  return (
    <Button onClick={onClick} type={type} {...props}>
      {icon && <span style={{ marginRight: "10px" }}>{icon}</span>}
      {children}
    </Button>
  );
}
