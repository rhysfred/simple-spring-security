
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { Stack } from "@mui/material";
import Authorisation from "../../services/Authorisation";
import Authentication from "../../services/Authentication";

const pages = [
  { text: "Home", link: "/" },
  { text: "Page 1", link: "/page1" },
  { text: "Page 2", link: "/page2" },
];

const adminPages = [
]

const secadminPages = [
  { text: "Users", link: "/users" },
]

function NavBar() {
  const [user, setUser] = useState(Authentication.getCurrentUser());
  const [UserAnchorEl, setUserAnchorEl] = useState(null);
  const userMenuOpen = Boolean(UserAnchorEl);
  if (setUser) {
  }

  const handleUserClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };
  const handleUserClose = () => {
    setUserAnchorEl(null);
  };
  const handleLogout = () => {
    Authentication.logout();
    setUserAnchorEl(null);
  };
  return (
    <AppBar position="static" sx={{ height: "75px" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Application Name
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                component={RouterLink}
                to={page.link}
                key={page.text}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.text}
              </Button>
            ))}
            {Authorisation.hasRole("secadmin") && secadminPages.map((page) => (
              <Button
                component={RouterLink}
                to={page.link}
                key={page.text}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.text}
              </Button>
            ))}
            {Authorisation.hasRole("admin") && adminPages.map((page) => (
              <Button
                component={RouterLink}
                to={page.link}
                key={page.text}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
          <Box alignSelf={"self-end"}>
            <Stack direction="row" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                User:
              </Typography>
              <Button
                key="user"
                disabled={!user}
                onClick={handleUserClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Stack direction="row" alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      mr: 2,
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    {user && user.username}
                  </Typography>
                  <ExpandCircleDownIcon />
                </Stack>
              </Button>
              <Menu
                id="user-menu"
                anchorEl={UserAnchorEl}
                open={userMenuOpen}
                onClose={handleUserClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem component={RouterLink} to="/change-password">
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
