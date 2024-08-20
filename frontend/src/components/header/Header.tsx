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
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import {
  IconHome2,
  IconHeart,
  IconUserCircle,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./HeaderSearch.module.css";
import recipe from "../../assets/recipe.png";

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
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const navItems = [
  { icon: IconHeart, label: "Favorilerim", to: "/favorites" },
  { icon: IconUserCircle, label: "Profilim", to: "/profile" },
  { icon: IconSettings, label: "Ayarlar", to: "/settings" },
];

export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const index = navItems.findIndex((item) => item.to === location.pathname);
    setActive(index !== -1 ? index : null);
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${classes.link}`)) {
        setActive(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const links = navItems.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <header className={classes.header}>
      <Flex justify="space-between" align="center" className={classes.inner}>
        <Group className={classes.logoGroup}>
          <Link to="/home">
            <Image src={recipe} alt="Yemek Tarifleri" height={40} />
          </Link>
        </Group>

        <Group gap={rem(8)} className={classes.iconGroup}>
          {links}
          <NavbarLink icon={IconLogout} label="Çıkış Yap" to="/logout" />
          <ActionIcon
            variant="outline"
            onClick={() => toggleColorScheme()}
            size="lg"
            aria-label="Toggle color scheme"
            className={classes.themeToggle}
          >
            {colorScheme === "dark" ? (
              <IconSun
                style={{ width: rem(20), height: rem(20) }}
                stroke={1.5}
              />
            ) : (
              <IconMoonStars
                style={{ width: rem(20), height: rem(20) }}
                stroke={1.5}
              />
            )}
          </ActionIcon>
        </Group>
      </Flex>
    </header>
  );
}

export default Header;
