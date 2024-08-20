import { Container, Text } from "@mantine/core";

interface RecipeErrorProps {
  message: string;
}

export function RecipeError({ message }: RecipeErrorProps) {
  return (
    <Container size="xl" style={{ textAlign: "center", marginTop: "2rem" }}>
      <Text color="red">{message}</Text>
    </Container>
  );
}
