import {
  Container,
  Title,
  Center,
  Group,
  Button,
  Box,
  Overlay,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTwitter,
} from "@tabler/icons-react";
import styles from "./SocialMediaFollow.module.css";

export function SocialMediaFollow() {
  return (
    <Box className={styles.container}>
      <Box className={styles.backgroundImage} />
      <Overlay
        gradient={`linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(60, 20, 0, 0.65) 40%)`}
        opacity={0.7}
        zIndex={0}
      />
      <Container size="xl" className={styles.content}>
        <Title order={2} className={styles.title}>
          Bizi Takip Edin
        </Title>
        <Center>
          <Group className={styles.buttonGroup}>
            <Button
              variant="outline"
              color="orange"
              component="a"
              href="https://www.instagram.com"
              target="_blank"
              className={styles.button}
            >
              <IconBrandInstagram size={24} className={styles.icon} />
              Instagram
            </Button>
            <Button
              variant="outline"
              color="blue"
              component="a"
              href="https://www.facebook.com"
              target="_blank"
              className={styles.button}
            >
              <IconBrandFacebook size={24} className={styles.icon} />
              Facebook
            </Button>
            <Button
              variant="outline"
              color="cyan"
              component="a"
              href="https://www.twitter.com"
              target="_blank"
              className={styles.button}
            >
              <IconBrandTwitter size={24} className={styles.icon} />
              Twitter
            </Button>
          </Group>
        </Center>
      </Container>
    </Box>
  );
}
