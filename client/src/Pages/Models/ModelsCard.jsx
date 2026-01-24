import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

const ModelsCard = ({ model, onEdit, onDelete }) => {
    const theme = useTheme();

    const getContentPreview = () => {
        const plainText = model.content.replace(/<[^>]*>/g, "");
        const preview = plainText.substring(0, 100);
        return preview + (plainText.length > 100 ? "..." : "");
    };

    return (
        <Card
            onClick={onEdit}
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
                {/* Header with title and delete button */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            component="h3"
                            gutterBottom
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            {model.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip label="Email Model" size="small" color="primary" variant="outlined" />
                            {model.configId && (
                                <Chip
                                    icon={<SettingsIcon sx={{ fontSize: "14px !important" }} />}
                                    label={typeof model.configId === "object" ? model.configId.name : "Configured"}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ fontSize: "0.7rem" }}
                                />
                            )}
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={onDelete}
                        sx={{
                            color: theme.palette.error.main,
                            "&:hover": { backgroundColor: `${theme.palette.error.main}10` },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Subject */}
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
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {model.subject}
                    </Typography>
                </Box>

                {/* Content Preview */}
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
                        {getContentPreview() || "No content"}
                    </Typography>
                </Box>

                {/* Created date */}
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    Created: {new Date(model.createdAt).toLocaleDateString()}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ModelsCard;