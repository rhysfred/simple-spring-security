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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [redirectOn, setRedirectOn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
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
    setCredentials({ username: "", password: "" });
  };

  const login = () => {
    Authentication.login(credentials.username, credentials.password)
      .then((user) => {
        if (user.accessToken) {
          setRedirectOn(true);
        } else {
          setRedirectOn(false);
        }
      })
      .catch((error) => {
        setRedirectOn(false);
        console.log("Network error authenticating: " + error);
      });
  };
  if (redirectOn) {
    return <Navigate to="/" replace />;
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
                value={credentials.username}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
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
                  label="Password"
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
                  <Button variant="contained" onClick={login} type="submit">
                    Login
                  </Button>
              </Box>
            </ListItem>
          </List>
        </Box>
      </BasicLayout>
    );
  }
}
