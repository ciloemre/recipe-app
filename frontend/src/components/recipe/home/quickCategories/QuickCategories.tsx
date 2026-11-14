import { Container, Group, Box, Text, Center } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./QuickCategories.module.css";

const categoryKeys = [
  {
    key: "soups" as const,
    image:
      "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "mains" as const,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "salads" as const,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "desserts" as const,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  },
];

export function QuickCategories() {
  const { t } = useTranslation();

  return (
    <Container size="xl" className={classes.container}>
      <Center>
        <Group className={classes.group}>
          {categoryKeys.map((category) => {
            const name = t(`categories.${category.key}`);
            return (
              <Box key={category.key} className={classes.categoryBox}>
                <Box className={classes.imageBox}>
                  <img
                    src={category.image}
                    alt={name}
                    className={classes.image}
                  />
                </Box>
                <Box className={classes.name}>
                  <Text>{name}</Text>
                </Box>
              </Box>
            );
          })}
        </Group>
      </Center>
    </Container>
  );
}
