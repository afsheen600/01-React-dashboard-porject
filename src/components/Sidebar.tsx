import * as React from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import useStore from "../store/appStore";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase-config";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import SettingsIcon from "@mui/icons-material/Settings";
import { clearUser } from "../store/userSlice";
import { useDispatch } from "react-redux";

// const dispatch = useDispatch();

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const dispatch = useDispatch(); // <-- move here if it's outside the component
  const { sidebarOpen, toggleSidebar } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser()); // ✅ clears Redux store
      localStorage.removeItem("user"); // ✅ clears localStorage
      toggleSidebar();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <MuiDrawer
      anchor="left"
      open={sidebarOpen}
      onClose={toggleSidebar}
      variant="temporary"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar - 1,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 1 }}>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/analytics");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/products");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <ProductionQuantityLimitsIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/settings");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "error.main" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </MuiDrawer>
  );
};

export default Sidebar;
