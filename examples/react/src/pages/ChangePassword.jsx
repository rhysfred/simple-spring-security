import { useState } from "react";
import { Navigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";

import BasicLayout from "../components/layout/BasicLayout";
import Authentication from "../services/Authentication";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [redirectOn, setRedirectOn] = useState(false);
  const [credentials, setCredentials] = useState({
    password: "",
    newPassword: ""
  });
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const clear = () => {
    setCredentials({ password: "", newPassword: "" });
  };

  const changePassword = (e) => {
    e.preventDefault();
    Authentication.changePassword(credentials.password, credentials.newPassword)
      .then(() => {
            setRedirectOn(true); 
      })
      .catch((error) => {
        setRedirectOn(false);
        console.log("Error changing password: " + JSON.stringify(error));
      });
  };
  if (redirectOn) {
    return (<Navigate to="/"  replace />)
  } else {
    return (
      <BasicLayout>
        <Box width={0.5}>
          <List>
            <ListItem>
              <TextField
                name="username"
                id="username"
                label="Username"
                variant="outlined"
                value={Authentication.getCurrentUser().username}
                fullWidth
                disabled="true"
              />
            </ListItem>
            <ListItem>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password">Current Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Current Password"
                />
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="newpassword">New Password</InputLabel>
                <OutlinedInput
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={credentials.newPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="New password"
                />
              </FormControl>
            </ListItem>
            <ListItem sx={{ display: "flex", flexDirection: "row-reverse" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={clear}>
                  Clear
                </Button>
                <Button variant="contained" onClick={changePassword} type="submit">
                  Change Password
                </Button>
              </Box>
            </ListItem>
          </List>
        </Box>
      </BasicLayout>
    );
  }
}
