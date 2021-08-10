import { theme as baseTheme, extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  shadows: {
    ...baseTheme.shadows,
    outline: "none",
  },
  styles: {
    global: {
      "html, body, #__next": {
        height: "full",
      },
    },
  },
});
