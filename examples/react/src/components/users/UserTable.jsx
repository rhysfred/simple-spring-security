import { useState, useEffect } from "react";
//import useSWR from "swr";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
//import { fetcher } from "../../utils/Fetcher";
import ModalUserEditor from "./ModalUserEditor";
//import { deleteJson } from "../../utils/RestJson";
import securityManagement from "../../services/SecurityManagement";

const columns = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "username",
    headerName: "Username",
    flex: 1,
    editable: false,
  },
  {
    field: "roles",
    headerName: "Roles",
    flex: 4,
    editable: false,
    valueGetter: (params) => {
      return params.value.join(", ");
    },
  },
];

export default function UserTable() {
  const [dataSelection, setDataSelection] = useState([]);
  const [userOpen, setUserOpen] = useState(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const [userOperation, setUserOperation ] = useState("Add");
  const [userToEdit, setUserToEdit] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      setUsers(await securityManagement.getUsers().catch(() => { return []; }));
    }
    getUsers();
  },[]);

  const handleAdd = () => {
    setUserOperation("Add");
    setUserOpen(true);
  };

  async function handleDelete() {
    await securityManagement.deleteUser(dataSelection[0]);
    setUsers(await securityManagement.getUsers().catch(() => { return []; }));
    setDataSelection([]);
    setDeleteButtonDisabled(true);
  }

  async function handleUserDialogClose() {
    setDataSelection([]);
    setUserOpen(false);
    setDeleteButtonDisabled(true);
    setUsers(await securityManagement.getUsers().catch(() => { return []; }));
  }

  function handleRowSelectionChange(rowSelectionModel) {
    if (rowSelectionModel && rowSelectionModel.length > 0) {
      setDeleteButtonDisabled(false);
    }
    setDataSelection(rowSelectionModel);
  }

  function getRowId(row) {
    return row.username;
  }

  function handleEdit(params) {
    setUserOperation("Edit");
    setUserToEdit({username: params.row.username, roles: params.row.roles})
    setUserOpen(true);
  }

  return (
    <Stack width={1}>
      {userOperation === "Edit" &&
      <ModalUserEditor
        open={userOpen}
        onClose={handleUserDialogClose}
        operation="Edit"
        username={userToEdit.username}
        roles={userToEdit.roles}
      />}
      {userOperation === "Add" &&
      <ModalUserEditor
        open={userOpen}
        onClose={handleUserDialogClose}
        operation="Add"
      />}
      <Box
        component="section"
        display="flex"
        width={1}
        mb={1}
        sx={{ border: "1px solid lightgrey", borderRadius: 1, padding: 1 }}
      >
        <Stack direction="row" justifyContent="flex-end" spacing={2} width={1}>
          <Button
            variant="contained"
            disabled={deleteButtonDisabled}
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete user
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add user
          </Button>
        </Stack>
      </Box>
      <Box sx={{ width: "100%", height: 500 }}>
        <DataGrid
          rows={users}
          getRowId={getRowId}
          columns={columns}
          columnVisibilityModel={{
            id: false,
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
            sorting: {
              sortModel: [{ field: "username", sort: "asc" }],
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          onRowSelectionModelChange={handleRowSelectionChange}
          rowSelectionModel={dataSelection}
          onRowDoubleClick={handleEdit}
        />
      </Box>
    </Stack>
  );
}
