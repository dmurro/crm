import { Link, Outlet } from "react-router-dom";
import { AppBar, Typography, Drawer, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeToggle } from "../resources/ThemeToggleProvider";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
  const { isLoggedIn, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", paddingRight: "3rem" }}>
      <Drawer
        variant="permanent"
        position="static"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItem component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component={Link} to="/clients">
            <ListItemText primary="Clients" />
          </ListItem>
          <ListItem component={Link} to="/email">
            <ListItemText primary="Email" />
          </ListItem>
          {isLoggedIn && (
            <ListItem onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
      <div style={{ flexGrow: 1 }}>
        {isLoggedIn && (
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Typography variant="h2" align="start">
              BENVENUTO, Davide
            </Typography>
            <IconButton onClick={toggleTheme} color="inherit">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </IconButton>
          </Box>
        )}
        <AppBar position="static">
          {/* <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
          </Toolbar> */}
        </AppBar>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
