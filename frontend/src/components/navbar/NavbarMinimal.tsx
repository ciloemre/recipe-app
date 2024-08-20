// import { useState } from "react";
// import { Tooltip, UnstyledButton, Stack, rem, Box } from "@mantine/core";
// import { Link, useLocation } from "react-router-dom";
// import {
//   IconHome2,
//   IconHeart,
//   IconUserCircle,
//   IconSettings,
//   IconLogout,
//   IconBook,
// } from "@tabler/icons-react";
// import classes from "./NavbarMinimal.module.css";

// interface NavbarLinkProps {
//   icon: typeof IconHome2;
//   label: string;
//   to: string;
//   active?: boolean;
//   onClick?(): void;
// }

// function NavbarLink({
//   icon: Icon,
//   label,
//   to,
//   active,
//   onClick,
// }: NavbarLinkProps) {
//   return (
//     <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
//       <UnstyledButton
//         component={Link}
//         to={to}
//         onClick={onClick}
//         className={classes.link}
//         data-active={active || undefined}
//       >
//         <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
//       </UnstyledButton>
//     </Tooltip>
//   );
// }

// const navItems = [
//   { icon: IconHome2, label: "Ana Sayfa", to: "/home" },
//   { icon: IconBook, label: "Yemek Tarifleri", to: "/recipes" },
//   { icon: IconHeart, label: "Favorilerim", to: "/favorites" },
//   { icon: IconUserCircle, label: "Profilim", to: "/profile" },
//   { icon: IconSettings, label: "Ayarlar", to: "/settings" },
// ];

// export function NavbarMinimal() {
//   const location = useLocation();
//   const [active, setActive] = useState(
//     navItems.findIndex((item) => item.to === location.pathname)
//   );

//   const links = navItems.map((link, index) => (
//     <NavbarLink
//       {...link}
//       key={link.label}
//       active={index === active}
//       onClick={() => setActive(index)}
//     />
//   ));

//   return (
//     <Box
//       className={classes.navbar}
//       style={{ height: "100%", display: "flex", flexDirection: "column" }}
//     >
//       <div className={classes.navbarMain} style={{ flex: 1 }}>
//         <Stack justify="center" gap={0}>
//           {links}
//         </Stack>
//       </div>
//       <Stack justify="center" gap={0} mb="xl">
//         <NavbarLink icon={IconLogout} label="Çıkış Yap" to="/logout" />
//       </Stack>
//     </Box>
//   );
// }

// export default NavbarMinimal;
