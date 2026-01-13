import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, useMediaQuery, useTheme, Toolbar, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import MarketingIcon from "@mui/icons-material/Campaign";
import CampaignIcon from "@mui/icons-material/Email";
import ModelsIcon from "@mui/icons-material/ModelTraining";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeToggle } from "../resources/ThemeToggleProvider";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const DRAWER_WIDTH = 240;

const Layout = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(location.pathname.startsWith("/marketing"));

  // Auto-expand marketing menu when on marketing routes
  useEffect(() => {
    setMarketingOpen(location.pathname.startsWith("/marketing"));
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log(user);

  const handleMarketingToggle = () => {
    setMarketingOpen(!marketingOpen);
  };

  const menuItemStyle = {
    "&.Mui-selected": {
      backgroundColor: `${theme.palette.primary.main}15`,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: `${theme.palette.primary.main}20`,
      },
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "& .MuiListItemText-primary": {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main}08`,
    },
    transition: "all 0.2s ease-in-out",
  };

  const subMenuItemStyle = {
    pl: 4,
    "&.Mui-selected": {
      backgroundColor: `${theme.palette.primary.main}15`,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: `${theme.palette.primary.main}20`,
      },
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "& .MuiListItemText-primary": {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main}08`,
    },
    transition: "all 0.2s ease-in-out",
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        <ListItem component={Link} to="/clients" onClick={() => isMobile && setMobileOpen(false)} selected={location.pathname === "/clients"} sx={menuItemStyle}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Clients" />
        </ListItem>
        <ListItem
          onClick={handleMarketingToggle}
          sx={{
            ...menuItemStyle,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}08`,
            },
          }}
        >
          <ListItemIcon>
            <MarketingIcon />
          </ListItemIcon>
          <ListItemText primary="Marketing" />
          {marketingOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={marketingOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem component={Link} to="/marketing/campaign" onClick={() => isMobile && setMobileOpen(false)} selected={location.pathname === "/marketing/campaign"} sx={subMenuItemStyle}>
              <ListItemIcon>
                <CampaignIcon />
              </ListItemIcon>
              <ListItemText primary="Campaign" />
            </ListItem>
            <ListItem component={Link} to="/marketing/models" onClick={() => isMobile && setMobileOpen(false)} selected={location.pathname === "/marketing/models"} sx={subMenuItemStyle}>
              <ListItemIcon>
                <ModelsIcon />
              </ListItemIcon>
              <ListItemText primary="Models" />
            </ListItem>
          </List>
        </Collapse>
        {isLoggedIn && (
          <ListItem
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: `${theme.palette.error.main}08`,
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {isLoggedIn && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                BENVENUTO, Davide
              </Typography>
            )}
            <IconButton onClick={toggleTheme} color="inherit">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }} aria-label="navigation">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: 7, md: 8 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
