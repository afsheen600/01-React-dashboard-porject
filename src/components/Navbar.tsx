import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import useStore from "../store/appStore";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../theme/themeContext";

const Navbar: React.FC = () => {
  const { toggleSidebar } = useStore();
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: "#335c67" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            data-testid="toggle sidebar"
            sx={{ mr: 2 }}
            onClick={toggleSidebar} // Toggle sidebar on click
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label="toggle theme"
            data-testid="toggle theme"
          >
            {mode === "light" ? (
              <Brightness4 data-testid="theme-icon-light" />
            ) : (
              <Brightness7 data-testid="theme-icon-dark" />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
