import { useState, useEffect } from "react";
import { Box, Typography, Button, Alert, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import apiClient from "../../services/api";
import ModelsGrid from "./ModelsGrid";
import ModelsEditorDialog from "./ModelsEditorDialog";

const Models = () => {
  const [models, setModels] = useState([]);
  const [templateConfigs, setTemplateConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configsLoading, setConfigsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  useEffect(() => {
    fetchModels();
    fetchTemplateConfigs();
  }, []);

  const fetchTemplateConfigs = async () => {
    try {
      setConfigsLoading(true);
      const response = await apiClient.get("/template-configs?limit=100");
      setTemplateConfigs(response.data.configs || []);
    } catch (err) {
      console.error("Error fetching template configs:", err);
    } finally {
      setConfigsLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/models");
      setModels(response.data.models || []);
    } catch (err) {
      console.error("Error fetching models:", err);
      setError(err.response?.data?.error || "Failed to fetch models");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = () => {
    setEditingModel(null);
    setEditorOpen(true);
  };

  const handleEditModel = (model) => {
    setEditingModel(model);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditingModel(null);
  };

  const handleSaveModel = (savedModel) => {
    if (editingModel) {
      setModels(models.map((m) => (m._id === editingModel._id ? savedModel : m)));
    } else {
      setModels([...models, savedModel]);
    }
    handleCloseEditor();
  };

  const handleDeleteModel = async (id, event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this model?")) return;

    try {
      setError(null);
      await apiClient.delete(`/models/${id}`);
      setModels(models.filter((model) => model._id !== id));
    } catch (err) {
      console.error("Error deleting model:", err);
      setError(err.response?.data?.error || "Failed to delete model");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">Models</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModel}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Create Model
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Models list */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : models.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
          <EmailIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No models yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click Create Model to get started
          </Typography>
        </Box>
      ) : (
        <ModelsGrid
          models={models}
          onEdit={handleEditModel}
          onDelete={handleDeleteModel}
        />
      )}

      {/* Editor Dialog */}
      <ModelsEditorDialog
        open={editorOpen}
        editingModel={editingModel}
        templateConfigs={templateConfigs}
        configsLoading={configsLoading}
        onClose={handleCloseEditor}
        onSave={handleSaveModel}
      />
    </Box>
  );
};

export default Models;