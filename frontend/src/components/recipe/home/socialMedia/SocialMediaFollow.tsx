import {
  ActionIcon,
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconChefHat,
  IconWorld,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../../../hooks/useRequireAuth";

const linkStyles = {
  root: {
    color: "var(--mantine-color-dimmed)",
    fontSize: "var(--mantine-font-size-sm)",
    width: "fit-content",
    "&:hover": {
      color: "#ff6b00",
      textDecoration: "none",
    },
  },
};

export function SocialMediaFollow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requireAuth } = useRequireAuth();

  const goHome = () => {
    if (location.pathname === "/home") {
      window.scrollTo(0, 0);
    }
  };

  const shareRecipe = () => {
    requireAuth(() => {
      if (location.pathname === "/create") {
        window.scrollTo(0, 0);
        return;
      }
      navigate("/create");
    });
  };

  return (
    <Box
      component="footer"
      py={{ base: "lg", sm: "xl" }}
      style={{
        backgroundColor: "light-dark(#f8f9fa, #1a2332)",
        borderTop: "1px solid light-dark(#e9ecef, #2c3544)",
      }}
    >
      <Container size="xl">
        <Flex
          direction={{ base: "column", sm: "row" }}
          align="flex-start"
          gap={{ base: "md", sm: 64 }}
        >
          <Stack gap="sm" maw={440} flex={{ base: "0 0 auto", sm: "1 1 280px" }}>
            <Group gap="xs" align="center" h={28}>
              <IconChefHat size={26} color="#ff6b00" />
              <Title order={4} lh={1}>
                Gastronova
              </Title>
            </Group>
            <Text size="sm" c="dimmed" maw={400}>
              Dünya mutfağından ilham veren tarifleri gerçek zamanlı keşfedin,
              kendi lezzetlerinizi paylaşın ve toplulukla etkileşime geçin.
            </Text>
          </Stack>

          <Flex
            direction={{ base: "column", sm: "row" }}
            justify={{ base: "flex-start", sm: "space-between" }}
            align="flex-start"
            wrap="nowrap"
            gap={{ base: "md", sm: 32 }}
            flex={{ base: "0 0 auto", sm: "1 1 280px" }}
          >
            <Stack gap={6}>
              <Text fw={700} size="sm" h={28} style={{ display: "flex", alignItems: "center" }}>
                Hızlı Bağlantılar
              </Text>
              <Anchor
                component={Link}
                to="/home"
                underline="never"
                styles={linkStyles}
                onClick={goHome}
              >
                Ana Sayfa
              </Anchor>
              <Anchor
                component="button"
                type="button"
                underline="never"
                onClick={shareRecipe}
                styles={linkStyles}
              >
                Tarif Paylaş
              </Anchor>
              <Anchor
                component="button"
                type="button"
                underline="never"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                styles={linkStyles}
              >
                Yukarı Çık
              </Anchor>
            </Stack>

            <Stack gap="sm">
              <Text fw={700} size="sm" h={28} style={{ display: "flex", alignItems: "center" }}>
                Proje & Geliştirici
              </Text>
              <Group gap="xs">
              <ActionIcon
                  component="a"
                  href="https://ciloemre.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="default"
                  size="lg"
                  radius="md"
                  aria-label="Portfolyo"
                >
                  <IconWorld size={18} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://www.linkedin.com/in/ciloemre"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="default"
                  size="lg"
                  radius="md"
                  aria-label="LinkedIn"
                >
                  <IconBrandLinkedin size={18} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://github.com/ciloemre"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="default"
                  size="lg"
                  radius="md"
                  aria-label="GitHub"
                >
                  <IconBrandGithub size={18} />
                </ActionIcon>
              </Group>
            </Stack>
          </Flex>
        </Flex>

        <Divider my={{ base: "sm", sm: "md" }} />

        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          gap="xs"
        >
          <Text size="sm" c="dimmed">
            © 2026 Gastronova. Tüm hakları saklıdır.
          </Text>
          <Text size="sm" c="dimmed">
            Emre Çilo tarafından geliştirilmiştir.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
