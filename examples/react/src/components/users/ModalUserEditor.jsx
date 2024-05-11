import {
  Dialog,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import securityManagement from "../../services/SecurityManagement";

export default function ModalUserEditor(props) {
  const [userModified, setUserModified] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    repeatPassword: false,
  });
  const [passwordResetSelected, setPasswordResetSelected] = useState(false);
  const [ allRoles, setAllRoles ] = useState([]);
  const [username, setUsername] = useState({
    value: props.username,
    valid: false,
    modified: false,
  });
  const [roles, setRoles] = useState({
    value: [],
    valid: false,
    modified: false,
  });
  const [password, setPassword] = useState({
    value: "",
    valid: false,
    modified: false,
  });

  const handleClickShowPassword = (type) => {
    setShowPassword({ ...showPassword, [type]: !showPassword[type] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function setUserField(user) {
    var valid = false;
    if (user.trim() !== "") {
      valid = true;
    }
    setUsername({ value: user, valid: valid, modified: true });
    setUserModified(true);
  }

  function setPasswordField(password) {
    var valid = false;
    if (password.trim() !== "" && password === repeatPassword) {
      valid = true;
    }
    setPassword({ value: password, valid: valid, modified: true });
    setUserModified(true);
  }

  function setRepeatPasswordField(repeatPassword) {
    var valid =
      password.value.trim() !== "" && password.value === repeatPassword;
    setPassword({ value: password.value, valid: valid, modified: true });
    setRepeatPassword(repeatPassword);
    setUserModified(true);
  }

  useEffect(() => {
    var valid = false;
    if (props.username && props.username.trim() !== "") {
      valid = true;
    }
    setUserModified(false);
    setUsername({ value: props.username, valid: valid, modified: false });
  }, [props.username]);

  useEffect(() => {
    var valid = false;
    if (!(Object.prototype.toString.call(props.roles) === "[object Array]")) {
      setUserModified(false);
      setRoles({ value: [], valid: valid, modified: false });
    } else {
      if (props.roles.length > 0) {
        valid = true;
      }
      setUserModified(false);
      setRoles({ value: props.roles, valid: valid, modified: false });
    }
  }, [props.roles]);
  
  useEffect(() => {
    async function getRoles() {
      setAllRoles(await securityManagement.getRoles().catch(() => { return []; }));
    }
    getRoles();
  },[]);

  function isSaveDisabled() {
    if (props.operation.toLowerCase() === "add" || (props.operation.toLowerCase() === "edit" && passwordResetSelected)) {
      if (!password.valid) {
        return true;
      }
    }
    if (username.valid && roles.valid && userModified) {
      return false;
    }
    return true;
  }
  const handleRoleToggle = (value) => () => {
    const currentIndex = roles.value.indexOf(value);
    const newChecked = [...roles.value];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setRoles({ value: newChecked, valid: true, modified: true });
    setUserModified(true);
  };

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.operation} a User</DialogTitle>
      <List sx={{ pt: 2, width: 400 }}>
        <ListItem key="listUsername">
          <TextField
            fullWidth
            size="small"
            error={username.modified && !username.valid}
            id="username"
            label="Username"
            variant="outlined"
            value={username.value}
            onChange={(event) => setUserField(event.target.value)}
          />
        </ListItem>
        {props.operation.toLowerCase() === "edit" && (
          <ListItem key="listResetPassword">
            <FormControlLabel
              control={
                <Checkbox
                  checked={passwordResetSelected}
                  onChange={() =>
                    setPasswordResetSelected(!passwordResetSelected)
                  }
                />
              }
              label="Reset Password"
            />
          </ListItem>
        )}
        {(props.operation.toLowerCase() === "add" || passwordResetSelected) && (
          <ListItem key="listPassword">
            <FormControl variant="outlined" fullWidth size="small">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                fullWidth
                error={password.modified && !password.valid}
                id="password"
                label="Password"
                variant="outlined"
                value={password.value}
                onChange={(event) => setPasswordField(event.target.value)}
                type={showPassword.password ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        handleClickShowPassword("password");
                      }}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.password ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ListItem>
        )}
        {(props.operation.toLowerCase() === "add" || passwordResetSelected) && (
          <ListItem key="listRepeatPassword">
            <FormControl variant="outlined" fullWidth size="small">
              <InputLabel htmlFor="password">Repeat Password</InputLabel>
              <OutlinedInput
                fullWidth
                error={password.modified && !password.valid}
                id="repeatPassword"
                label="Repeat Password"
                variant="outlined"
                value={repeatPassword}
                onChange={(event) => setRepeatPasswordField(event.target.value)}
                type={showPassword.repeatPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        handleClickShowPassword("repeatPassword");
                      }}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.repeatPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ListItem>
        )}
        <ListItem key="listRoles">
          <Paper
            sx={{ width: "100%", height: "8rem", overflow: "auto" }}
            elevation={0}
            variant="outlined"
          >
            <List dense >
              {allRoles.map((role) => {
                const labelId = `${role}-label`;

                return (
                  <ListItemButton
                    key={role}
                    role="listitem"
                    onClick={handleRoleToggle(role)}
                    sx={{ height: "1.6rem" }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={roles.value.indexOf(role) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={role} />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        </ListItem>
        <ListItem key="buttons">
          <Grid container columns={2} spacing={0} width="100%">
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button variant="outline" onClick={props.onClose}>
                Cancel
              </Button>
            </Grid>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaveDisabled()}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Dialog>
  );

  function handleSave(e) {
    e.preventDefault();
    var user = {};

    user.username = username.value;
    if (props.operation.toLowerCase() === "add" || passwordResetSelected) {
      user.password = password.value;
    }
    user.roles = roles.value;

    if (props.operation.toLowerCase() === "add") {
      try {
        securityManagement.createUser(user).then(() => { props.onClose() } );
      } catch(error) {
        console.log("Error adding User: " + error);
      }
      /*
      postJson(updateUrl, user).then((response) => {
        if (response.status === 200) {
          props.onClose();
        } else {
          console.log("Error adding Rule: " + response.status);
        }
      });
      */
    } else if (props.operation.toLowerCase() === "edit") {
      try {
        securityManagement.modifyUser(user).then(() => { props.onClose() } );
      } catch(error) {
        console.log("Error modifying User: " + error);
      }
      /*
      putJson(updateUrl, user.username, user).then((response) => {
        if (response.status === 200) {
          props.onClose();
        } else {
          console.log("Error adding Rule: " + response.status);
        }
      });
      */
    }
  }
}
