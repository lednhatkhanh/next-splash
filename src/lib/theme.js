import { unstable_createMuiStrictModeTheme } from "@material-ui/core/styles";
import { yellow, pink } from "@material-ui/core/colors";

export const theme = unstable_createMuiStrictModeTheme({
  palette: { type: "dark", primary: yellow, secondary: pink },
});
