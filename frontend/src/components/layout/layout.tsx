import React from "react";
import { AppShell } from "@mantine/core";
import Header from "../header/Header";
import { SocialMediaFollow } from "../recipe/home/socialMedia/SocialMediaFollow";
import classes from "./layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main className={classes.main}>
        <div className={classes.page}>{children}</div>
        <SocialMediaFollow />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
