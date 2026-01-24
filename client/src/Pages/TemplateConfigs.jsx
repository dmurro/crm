import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../services/api";

const TemplateConfigs = () => {
  const theme = useTheme();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isDefault: false,
    colors: {
      primary: "#1976d2",
      secondary: "#dc004e",
      background: "#ffffff",
      text: "#000000",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
    },
    spacing: {
      padding: 20,
      margin: 10,
    },
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/template-configs?limit=100");
      setConfigs(response.data.configs || []);
    } catch (err) {
      console.error("Error fetching template configs:", err);
      setError(err.response?.data?.error || "Failed to fetch template configs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = () => {
    setEditingConfig(null);
    setFormData({
      name: "",
      description: "",
      isDefault: false,
      colors: {
        primary: "#1976d2",
        secondary: "#dc004e",
        background: "#ffffff",
        text: "#000000",
      },
      fonts: {
        heading: "Arial, sans-serif",
        body: "Arial, sans-serif",
      },
      spacing: {
        padding: 20,
        margin: 10,
      },
    });
    setDialogOpen(true);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      description: config.description || "",
      isDefault: config.isDefault || false,
      colors: config.colors || {
        primary: "#1976d2",
        secondary: "#dc004e",
        background: "#ffffff",
        text: "#000000",
      },
      fonts: config.fonts || {
        heading: "Arial, sans-serif",
        body: "Arial, sans-serif",
      },
      spacing: config.spacing || {
        padding: 20,
        margin: 10,
      },
    });
    setDialogOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!formData.name.trim()) {
      setError("Config name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const savePromise = editingConfig
        ? apiClient.put(`/template-configs/${editingConfig._id}`, formData)
        : apiClient.post("/template-configs", formData);

      const response = await savePromise;

      if (editingConfig) {
        setConfigs(configs.map((config) => (config._id === editingConfig._id ? response.data.config : config)));
      } else {
        setConfigs([...configs, response.data.config]);
      }

      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving template config:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to save template config");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (id, event) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this template config?")) {
      return;
    }

    try {
      setError(null);
      await apiClient.delete(`/template-configs/${id}`);
      setConfigs(configs.filter((config) => config._id !== id));
    } catch (err) {
      console.error("Error deleting template config:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to delete template config");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingConfig(null);
  };

  return (
    <Box>
      {/* Header with Create Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Template Configs
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateConfig} sx={{ borderRadius: 2, textTransform: "none", px: 3 }}>
          Create Config
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Configs Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : configs.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
          <SettingsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No template configs yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click &quot;Create Config&quot; to get started
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {configs.map((config) => (
            <Grid item xs={12} sm={6} md={4} key={config._id}>
              <Card
                onClick={() => handleEditConfig(config)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 2,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {config.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip label="Template Config" size="small" color="primary" variant="outlined" />
                        {config.isDefault && <Chip label="Default" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.7rem" }} />}
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteConfig(config._id, e)}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.error.main}10`,
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {config.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {config.description}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    Created: {new Date(config.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingConfig ? "Edit Template Config" : "Create New Template Config"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Config Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter config name"
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description (optional)"
              multiline
              rows={3}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />}
              label="Set as default"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" startIcon={<CloseIcon />} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSaveConfig} variant="contained" startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />} disabled={!formData.name.trim() || saving}>
            {editingConfig ? "Update Config" : "Create Config"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateConfigs;
