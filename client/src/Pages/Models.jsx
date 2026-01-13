import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Card, CardContent, Grid, Chip, IconButton, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from "@mui/material";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-newsletter";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const Models = () => {
  const theme = useTheme();
  const [models, setModels] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modelName, setModelName] = useState("");
  const [modelSubject, setModelSubject] = useState("");
  const editorRef = useRef(null);
  const grapesEditorRef = useRef(null);

  // Create default model on mount
  useEffect(() => {
    const defaultModel = {
      id: Date.now(),
      name: "Default Email Model",
      subject: "Welcome to our service!",
      content: "<p>Hello! This is a default email template. You can customize it as needed.</p>",
      createdAt: new Date().toISOString(),
    };
    setModels([defaultModel]);
  }, []);

  // Initialize GrapesJS editor
  useEffect(() => {
    if (!editorOpen) {
      // Clean up when dialog closes
      if (grapesEditorRef.current) {
        grapesEditorRef.current.destroy();
        grapesEditorRef.current = null;
      }
      return;
    }

    // Wait for dialog to be fully rendered before initializing editor
    const timer = setTimeout(() => {
      if (editorRef.current && !grapesEditorRef.current) {
        console.log("Initializing GrapesJS editor...", editorRef.current);
        try {
          const editor = grapesjs.init({
            container: editorRef.current,
            height: "100%",
            width: "100%",
            plugins: ["gjs-preset-newsletter"],
            pluginsOpts: {
              "gjs-preset-newsletter": {
                modalTitleImport: "Import template",
                modalTitleExport: "Export template",
                modalLabelImport: "",
                modalLabelExport: "",
                modalBtnImport: "Import",
                modalBtnExport: "Export",
                importViewerOptions: {
                  importButton: "Import",
                  cancelButton: "Cancel",
                },
                textViewer: {
                  buttonLabel: "Close",
                  placeholder: "Click on Import to add the code",
                },
                importPlaceholder: '<table class="table"><tr><td>Hello world!</td></tr></table>',
                inlineCss: true,
              },
            },
            storageManager: false,
            canvas: {
              styles: ["https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900", "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,800"],
            },
            deviceManager: {
              devices: [
                {
                  name: "Desktop",
                  width: "",
                },
                {
                  name: "Tablet",
                  width: "768px",
                  widthMedia: "992px",
                },
                {
                  name: "Mobile",
                  width: "320px",
                  widthMedia: "768px",
                },
              ],
            },
          });

          // Add custom base components after editor is ready
          editor.on("load", () => {
            const blockManager = editor.BlockManager;

            // 1. Header Component
            blockManager.add("header-component", {
              label: "Header",
              category: "Base Components",
              content: `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2563eb; padding: 20px 0;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; font-family: Arial, sans-serif;">
                        Your Company Name
                      </h1>
                    </td>
                  </tr>
                </table>
              `,
            });

            // 2. Text Component
            blockManager.add("text-component", {
              label: "Text",
              category: "Base Components",
              content: `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
                  <tr>
                    <td style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </td>
                  </tr>
                </table>
              `,
            });

            // 3. Button Component
            blockManager.add("button-component", {
              label: "Button",
              category: "Base Components",
              content: `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <a href="https://example.com" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">
                        Click Here
                      </a>
                    </td>
                  </tr>
                </table>
              `,
            });

            // 4. Image Component
            blockManager.add("image-component", {
              label: "Image",
              category: "Base Components",
              content: `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
                  <tr>
                    <td align="center" style="padding: 10px;">
                      <img src="https://via.placeholder.com/600x300/2563eb/ffffff?text=Your+Image" alt="Image" width="600" style="max-width: 100%; height: auto; display: block;" />
                    </td>
                  </tr>
                </table>
              `,
            });

            // 5. Footer Component
            blockManager.add("footer-component", {
              label: "Footer",
              category: "Base Components",
              content: `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e293b; padding: 30px 20px;">
                  <tr>
                    <td align="center" style="padding: 10px;">
                      <p style="color: #ffffff; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
                        © 2024 Your Company. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 5px;">
                      <p style="color: #cbd5e1; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">
                        123 Street Name, City, Country
                      </p>
                    </td>
                  </tr>
                </table>
              `,
            });
          });

          grapesEditorRef.current = editor;
          console.log("GrapesJS editor initialized successfully", editor);

          // Set initial content if editing (with a small delay to ensure editor is ready)
          if (editingModel && editingModel.content) {
            setTimeout(() => {
              try {
                // Extract HTML from the stored content (which includes style tag)
                const htmlMatch = editingModel.content.match(/<style>.*?<\/style>(.*)/s);
                const htmlContent = htmlMatch ? htmlMatch[1] : editingModel.content;
                if (htmlContent && htmlContent.trim()) {
                  editor.setComponents(htmlContent);
                }
              } catch (error) {
                console.error("Error loading editor content:", error);
              }
            }, 300);
          }
        } catch (error) {
          console.error("Error initializing GrapesJS editor:", error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (grapesEditorRef.current) {
        grapesEditorRef.current.destroy();
        grapesEditorRef.current = null;
      }
    };
  }, [editorOpen, editingModel]);

  const handleCreateModel = () => {
    setEditingModel(null);
    setModelName("");
    setModelSubject("");
    setEditorOpen(true);
  };

  const handleEditModel = (model) => {
    setEditingModel(model);
    setModelName(model.name);
    setModelSubject(model.subject);
    setEditorOpen(true);
  };

  const handleSaveModel = () => {
    if (!modelName.trim() || !modelSubject.trim() || !grapesEditorRef.current) {
      return;
    }

    // Get HTML content from GrapesJS editor
    const htmlContent = grapesEditorRef.current.getHtml();
    const cssContent = grapesEditorRef.current.getCss();

    // Combine HTML and CSS
    const fullContent = `<style>${cssContent}</style>${htmlContent}`;

    const modelData = {
      name: modelName.trim(),
      subject: modelSubject.trim(),
      content: fullContent,
    };

    if (editingModel) {
      // Update existing model
      setModels(
        models.map((model) =>
          model.id === editingModel.id
            ? {
                ...model,
                ...modelData,
                updatedAt: new Date().toISOString(),
              }
            : model
        )
      );
    } else {
      // Create new model
      const newModel = {
        id: Date.now(),
        ...modelData,
        createdAt: new Date().toISOString(),
      };
      setModels([...models, newModel]);
    }

    handleCloseEditor();
  };

  const handleCloseEditor = () => {
    if (grapesEditorRef.current) {
      grapesEditorRef.current.destroy();
      grapesEditorRef.current = null;
    }
    setEditorOpen(false);
    setEditingModel(null);
    setModelName("");
    setModelSubject("");
  };

  const handleDeleteModel = (id, event) => {
    event.stopPropagation();
    setModels(models.filter((model) => model.id !== id));
  };

  return (
    <Box>
      {/* Header with Create Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Models
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModel}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Create Model
        </Button>
      </Box>

      {/* Models Section */}
      {models.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <EmailIcon
            sx={{
              fontSize: 64,
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No models yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click &quot;Create Model&quot; to get started
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {models.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <Card
                onClick={() => handleEditModel(model)}
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {model.name}
                      </Typography>
                      <Chip label="Email Model" size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteModel(model.id, e)}
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

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Subject
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      {model.subject}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Content Preview
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {model.content.replace(/<[^>]*>/g, "").substring(0, 100) || "No content"}
                      {model.content.replace(/<[^>]*>/g, "").length > 100 && "..."}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.7rem",
                    }}
                  >
                    Created: {new Date(model.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Editor Dialog */}
      <Dialog
        open={editorOpen}
        onClose={handleCloseEditor}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: "95vh",
            maxHeight: "95vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="div">
              {editingModel ? "Edit Model" : "Create New Model"}
            </Typography>
            <IconButton onClick={handleCloseEditor} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", p: 0 }}>
          <Stack spacing={2} sx={{ p: 2, pb: 1 }}>
            <TextField label="Model Name" fullWidth size="small" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Enter model name" required />
            <TextField label="Email Subject" fullWidth size="small" value={modelSubject} onChange={(e) => setModelSubject(e.target.value)} placeholder="Enter email subject" required />
          </Stack>
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              minHeight: "600px",
              "& .gjs-editor": {
                height: "100%",
                minHeight: "600px",
              },
              "& .gjs-cv-canvas": {
                top: 0,
                width: "100%",
              },
              "& .gjs-pn-panels": {
                height: "100%",
              },
            }}
          >
            <div
              ref={editorRef}
              style={{
                height: "100%",
                width: "100%",
                minHeight: "600px",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseEditor} variant="outlined" startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSaveModel} variant="contained" startIcon={<SaveIcon />} disabled={!modelName.trim() || !modelSubject.trim()}>
            {editingModel ? "Update Model" : "Create Model"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Models;
