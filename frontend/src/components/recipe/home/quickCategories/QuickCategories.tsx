import { Container, Group, Box, Text, Center } from "@mantine/core";
import classes from "./QuickCategories.module.css";

const quickCategories = [
  {
    name: "Çorbalar",
    image:
      "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Yemekler",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Salatalar",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Tatlılar",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
];

export function QuickCategories() {
  return (
    <Container size="xl" className={classes.container}>
      <Center>
        <Group className={classes.group}>
          {quickCategories.map((category) => (
            <Box key={category.name} className={classes.categoryBox}>
              <Box className={classes.imageBox}>
                <img
                  src={category.image}
                  alt={category.name}
                  className={classes.image}
                />
              </Box>
              <Box className={classes.name}>
                <Text>{category.name}</Text>
              </Box>
            </Box>
          ))}
        </Group>
      </Center>
    </Container>
  );
}
