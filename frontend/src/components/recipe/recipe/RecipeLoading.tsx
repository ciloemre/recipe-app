import { Container, Loader, Text } from "@mantine/core";

export function RecipeLoading() {
  return (
    <Container size="xl" style={{ textAlign: "center", marginTop: "2rem" }}>
      <Loader size="xl" />
      <Text>Tarifler yükleniyor...</Text>
    </Container>
  );
}
