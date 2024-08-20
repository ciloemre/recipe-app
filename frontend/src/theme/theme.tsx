import { MantineThemeOverride, MantineTheme } from "@mantine/core";

export const theme: MantineThemeOverride = {
  primaryColor: "orange",
  colors: {
    orange: [
      "#FFF4E6",
      "#FFE8CC",
      "#FFD8A8",
      "#FFC078",
      "#FFA94D",
      "#FF922B",
      "#FD7E14",
      "#F76707",
      "#E8590C",
      "#D9480F",
    ],
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
  fontFamily: "Poppins, sans-serif",
  headings: { fontFamily: "Poppins, sans-serif" },
  components: {
    Button: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius?.md,
        },
      }),
    },
  },
};
