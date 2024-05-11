import { React } from "react";

import Grid from "@mui/material/Unstable_Grid2/Grid2";

import BasicLayout from "../components/layout/BasicLayout";
import UserTable from "../components/users/UserTable";

export default function Users() {

  return (
    <BasicLayout>
      <Grid container columns={12} width="95%" spacing={2}>
      <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <UserTable/>
        </Grid>
      </Grid>
    </BasicLayout>
  );
}