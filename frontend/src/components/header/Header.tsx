import { useState, useEffect } from "react";
import {
  Group,
  rem,
  Flex,
  ActionIcon,
  useMantineColorScheme,
  Tooltip,
  UnstyledButton,
  Image,
  Button,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconToolsKitchen2,
  IconHome2,
  IconUserCircle,
  IconLogout,
  IconPlus,
  IconHeart,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./HeaderSearch.module.css";
import recipe from "../../assets/recipe.png";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { NotificationBell } from "./NotificationBell";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  to: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  to,
  active,
  onClick,
}: NavbarLinkProps) {
  return (
    <Tooltip
      label={label}
      position="bottom"
      transitionProps={{ duration: 0 }}
      className={classes.customTooltip}
    >
      <UnstyledButton
        component={Link}
        to={to}
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.7} />
        <span className={classes.linkLabel}>{label}</span>
      </UnstyledButton>
    </Tooltip>
  );
}

export function Header() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [active, setActive] = useState<number | null>(null);

  const authNavItems = [
    { icon: IconToolsKitchen2, label: t("nav.recipes"), to: "/recipes" },
    { icon: IconHeart, label: t("nav.favorites"), to: "/favorites" },
    { icon: IconUserCircle, label: t("nav.profile"), to: "/profile" },
  ];

  const guestNavItems = [
    { icon: IconToolsKitchen2, label: t("nav.recipes"), to: "/recipes" },
  ];

  const navItems = user ? authNavItems : guestNavItems;

  useEffect(() => {
    const index = navItems.findIndex((item) => item.to === location.pathname);
    setActive(index !== -1 ? index : null);
  }, [location, user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${classes.link}`)) {
        setActive(null);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const links = navItems.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.to}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  const handleAddRecipe = () => {
    requireAuth(() => navigate("/create"));
  };

  return (
    <header className={classes.header}>
      <Flex justify="space-between" align="center" className={classes.inner}>
        <Group className={classes.logoGroup}>
          <Link to="/home">
            <Image src={recipe} alt={t("nav.logoAlt")} height={40} />
          </Link>
        </Group>

        <Group gap={0} align="center" wrap="nowrap" className={classes.iconGroup}>
          <div className={classes.toolbar}>
            <div className={classes.cluster}>{links}</div>

            {user ? (
              <>
                <span className={classes.sep} aria-hidden="true" />
                <div className={classes.cluster}>
                  <NotificationBell />
                </div>
                <span className={classes.sep} aria-hidden="true" />
                <div className={classes.cluster}>
                  <Tooltip label={t("nav.addRecipe")} position="bottom">
                    <UnstyledButton
                      className={classes.addButton}
                      onClick={handleAddRecipe}
                      aria-label={t("nav.addRecipe")}
                    >
                      <IconPlus
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.7}
                      />
                      <span className={classes.linkLabel}>{t("nav.add")}</span>
                    </UnstyledButton>
                  </Tooltip>
                </div>
                <span className={classes.sep} aria-hidden="true" />
                <div className={classes.cluster}>
                  <NavbarLink icon={IconLogout} label={t("nav.logout")} to="/logout" />
                </div>
              </>
            ) : (
              <>
                <span className={classes.sep} aria-hidden="true" />
                <div className={classes.cluster}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="subtle"
                    className={classes.authButton}
                  >
                    {t("nav.login")}
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="filled"
                    color="orange"
                    className={classes.authButton}
                  >
                    {t("nav.register")}
                  </Button>
                </div>
              </>
            )}

            <span className={classes.sep} aria-hidden="true" />
            <div className={classes.cluster}>
              <LanguageSwitcher />
            </div>

            <span className={classes.sep} aria-hidden="true" />
            <div className={classes.cluster}>
              <Tooltip label={t("common.theme")} position="bottom">
                <ActionIcon
                  variant="subtle"
                  onClick={() => toggleColorScheme()}
                  size={36}
                  radius={12}
                  aria-label={t("common.theme")}
                  className={classes.themeToggle}
                >
                  {colorScheme === "dark" ? (
                    <IconSun
                      style={{ width: rem(18), height: rem(18) }}
                      stroke={1.7}
                    />
                  ) : (
                    <IconMoonStars
                      style={{ width: rem(18), height: rem(18) }}
                      stroke={1.7}
                    />
                  )}
                </ActionIcon>
              </Tooltip>
            </div>
          </div>
        </Group>
      </Flex>
    </header>
  );
}

export default Header;
