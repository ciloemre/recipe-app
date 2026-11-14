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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
                {t("common.appName")}
              </Title>
            </Group>
            <Text size="sm" c="dimmed" maw={400}>
              {t("footer.tagline")}
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
                {t("footer.quickLinks")}
              </Text>
              <Anchor
                component={Link}
                to="/home"
                underline="never"
                styles={linkStyles}
                onClick={goHome}
              >
                {t("nav.home")}
              </Anchor>
              <Anchor
                component="button"
                type="button"
                underline="never"
                onClick={shareRecipe}
                styles={linkStyles}
              >
                {t("footer.shareRecipe")}
              </Anchor>
              <Anchor
                component="button"
                type="button"
                underline="never"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                styles={linkStyles}
              >
                {t("footer.backToTop")}
              </Anchor>
            </Stack>

            <Stack gap="sm">
              <Text fw={700} size="sm" h={28} style={{ display: "flex", alignItems: "center" }}>
                {t("footer.projectDev")}
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
                  aria-label={t("footer.portfolio")}
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
            {t("footer.rights")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("footer.developedBy")}
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
