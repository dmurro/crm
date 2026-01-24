import { DialogActions, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const EditorActions = ({ isEditing, saving, canSave, onClose, onSave }) => {
    return (
        <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
            <Button
                onClick={onClose}
                variant="outlined"
                startIcon={<CloseIcon />}
                disabled={saving}
            >
                Cancel
            </Button>
            <Button
                onClick={onSave}
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                disabled={!canSave || saving}
            >
                {isEditing ? "Update Model" : "Create Model"}
            </Button>
        </DialogActions>
    );
};

export default EditorActions;