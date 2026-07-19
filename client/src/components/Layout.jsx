import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box className="app-shell">
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Hi{" "}
            {user?.role === "admin"
              ? "Admin "
              : user?.role === "agent"
              ? "Agent "
              : ""}
            {user?.name}
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<DashboardIcon />}
          >
            {user?.role === "agent" ? "View Complaints" : "Dashboard"}
          </Button>

          {user?.role === "user" && (
            <Button
              color="inherit"
              component={Link}
              to="/complaints/new"
              startIcon={<AddCircleOutlineIcon />}
            >
              Complaint Register
            </Button>
          )}

          {user?.role === "admin" && (
            <Button
              color="inherit"
              component={Link}
              to="/admin"
              startIcon={<ManageAccountsIcon />}
            >
              Admin
            </Button>
          )}

          <Button
            color="inherit"
            component={Link}
            to="/notifications"
            startIcon={<NotificationsIcon />}
          >
            Notifications
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/profile"
            startIcon={<PersonIcon />}
          >
            Profile
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={doLogout}
            startIcon={<LogoutIcon />}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }} className="app-content">
        <Outlet />
      </Container>

      <Box className="footer-bar">
        <Typography>ComplaintCare</Typography>
        <Typography sx={{ mt: 1 }}>© 2024</Typography>
      </Box>
    </Box>
  );
}