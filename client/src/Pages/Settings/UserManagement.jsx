import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Pagination,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  DeleteForever,
  FilterList,
  Clear,
} from "@mui/icons-material";
import apiClient from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotal] = useState(0);
  const limit = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
    isActive: true,
  });

  const [, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter, activeFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (activeFilter !== "") params.isActive = activeFilter;

      const { data } = await apiClient.get("/users", { params });

      setUsers(data.users);
      setTotalPages(data.pagination.pages);
      setTotal(data.pagination.total);
    } catch (error) {
      showNotification(
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        "Failed to fetch users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
      setFormData({ ...user, password: "" });
    } else {
      setEditMode(false);
      setCurrentUser(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
        isActive: true,
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      if (editMode && !payload.password) delete payload.password;

      const { data } = editMode
        ? await apiClient.put(`/users/${currentUser._id}`, payload)
        : await apiClient.post("/users", payload);

      showNotification(data.message, "success");
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleDelete = async (id, hard = false) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const { data } = await apiClient.delete(
        hard ? `/users/${id}/hard` : `/users/${id}`
      );

      showNotification(data.message, "success");
      fetchUsers();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setActiveFilter("");
    setPage(1);
  };

  const hasActiveFilters = searchTerm || roleFilter || activeFilter !== "";

  const roleColor = (role) =>
    role === "admin" ? "error" : role === "manager" ? "warning" : "default";

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600}>
          User Management
        </Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          size="large"
          onClick={() => handleOpenDialog()}
          sx={{ px: 3 }}
        >
          Add User
        </Button>
      </Stack>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Toolbar with Filters */}
        <Toolbar
          sx={{
            bgcolor: "grey.50",
            borderBottom: 1,
            borderColor: "divider",
            gap: 2,
            flexWrap: "wrap",
            py: 2,
          }}
        >
          <FilterList sx={{ color: "text.secondary" }} />

          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250, bgcolor: "white" }}
          />

          <FormControl size="small" sx={{ minWidth: 140, bgcolor: "white" }}>
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, bgcolor: "white" }}>
            <Select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={handleClearFilters}
                sx={{ ml: "auto" }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow
                    key={u._id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{`${u.firstName || ""} ${u.lastName || ""
                      }`.trim() || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role.toUpperCase()}
                        color={roleColor(u.role)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.isActive ? "Active" : "Inactive"}
                        color={u.isActive ? "success" : "default"}
                        size="small"
                        variant={u.isActive ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit user">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(u)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Soft delete">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleDelete(u._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hard delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(u._id, true)}
                        >
                          <DeleteForever fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ py: 3, borderTop: 1, borderColor: "divider" }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Paper>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          {editMode ? "Edit User" : "Add User"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
              required={!editMode}
              helperText={editMode ? "Leave blank to keep current password" : ""}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                fullWidth
              />
            </Stack>

            <FormControl fullWidth>
              <Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)} size="large">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} size="large">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;