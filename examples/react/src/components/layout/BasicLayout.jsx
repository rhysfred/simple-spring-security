import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../nav/NavBar';
import Grid from '@mui/material/Unstable_Grid2/Grid2';


export default function BasicLayout(props) {
  return (
    <>
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar position="fixed" />
    </Box>
    <Box margin={4}>
      <Grid container>
        <Grid item xs display="flex" justifyContent="center" alignItems="center">
          {props.children}
        </Grid>
      </Grid>
    </Box>
    </>
  );
}