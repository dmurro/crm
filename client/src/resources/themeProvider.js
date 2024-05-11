// antdTheme.js
import { createTheme } from "@ant-design/colors";
import theme from "./theme";

const colors = createTheme(theme.colors);

const themeProvider = {
  ...colors,
  Button: {
    ...colors.Button,
    ...theme.button,
  },
  typography: {
    ...colors.Typography,
    ...theme.fontSizes,
  },
};

export default themeProvider;
