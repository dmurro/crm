import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Layout = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
      <Drawer
        variant="permanent"
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Layout;
