import React from "react";
import { Center, Loader } from "@mantine/core";

export const LoadingSpinner: React.FC = () => (
  <Center mih={240} py="xl">
    <Loader color="orange" size="lg" />
  </Center>
);
