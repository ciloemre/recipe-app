import React from "react";
import { AppShell } from "@mantine/core";
import Header from "../header/Header";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default Layout;
