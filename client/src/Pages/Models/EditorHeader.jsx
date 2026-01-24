import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Button,
    IconButton,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditorHeader = ({
    isEditing,
    modelName,
    modelSubject,
    selectedConfigId,
    templateConfigs,
    configsLoading,
    onModelNameChange,
    onModelSubjectChange,
    onConfigChange,
    onApplyDesign,
    onClose,
    error,
}) => {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: "divider",
                    flexShrink: 0,
                }}
            >
                <Typography variant="h6" component="div" sx={{ minWidth: 180 }}>
                    {isEditing ? "Edit Model" : "Create New Model"}
                </Typography>

                <TextField
                    label="Model Name"
                    size="small"
                    value={modelName}
                    onChange={(e) => onModelNameChange(e.target.value)}
                    placeholder="Enter model name"
                    required
                    sx={{ minWidth: 200, flexShrink: 0 }}
                />

                <TextField
                    label="Email Subject"
                    size="small"
                    value={modelSubject}
                    onChange={(e) => onModelSubjectChange(e.target.value)}
                    placeholder="Enter email subject"
                    required
                    sx={{ minWidth: 250, flexShrink: 0 }}
                />

                <FormControl size="small" sx={{ minWidth: 250, flexShrink: 0 }}>
                    <InputLabel>Template Config (Optional)</InputLabel>
                    <Select
                        value={selectedConfigId}
                        label="Template Config (Optional)"
                        onChange={(e) => onConfigChange(e.target.value)}
                        disabled={configsLoading}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {templateConfigs.map((config) => (
                            <MenuItem key={config._id} value={config._id}>
                                {config.name}
                                {config.isDefault && (
                                    <Chip
                                        label="Default"
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                        sx={{ ml: 1, height: 20, fontSize: "0.65rem" }}
                                    />
                                )}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1 }} />

                {selectedConfigId && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={onApplyDesign}
                        sx={{ textTransform: "none", fontSize: "0.75rem", minWidth: "auto", flexShrink: 0 }}
                    >
                        Apply Design
                    </Button>
                )}

                <Button
                    variant="text"
                    size="small"
                    onClick={() => window.open("/marketing/template-configs", "_blank")}
                    sx={{ textTransform: "none", fontSize: "0.75rem", minWidth: "auto", flexShrink: 0 }}
                >
                    Manage Configs
                </Button>

                <IconButton onClick={onClose} size="small" sx={{ flexShrink: 0 }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mx: 3, mt: 2 }} onClose={() => { }}>
                    {error}
                </Alert>
            )}
        </>
    );
};

export default EditorHeader;