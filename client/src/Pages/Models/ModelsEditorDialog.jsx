import { useState, useRef, useEffect } from "react";
import { Dialog } from "@mui/material";
import apiClient from "../../services/api";
import EditorHeader from "./EditorHeader";
import EditorContent from "./EditorContent";
import EditorActions from "./EditorActions";
import { createDesignFromConfig } from "./utils";

const ModelsEditorDialog = ({
    open,
    editingModel,
    templateConfigs,
    configsLoading,
    onClose,
    onSave,
}) => {
    const [modelName, setModelName] = useState("");
    const [modelSubject, setModelSubject] = useState("");
    const [selectedConfigId, setSelectedConfigId] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const emailEditorRef = useRef(null);

    // Reset form when dialog opens/closes or model changes
    useEffect(() => {
        if (open) {
            if (editingModel) {
                setModelName(editingModel.name);
                setModelSubject(editingModel.subject);
                setSelectedConfigId(editingModel.configId?._id || editingModel.configId || "");
            } else {
                setModelName("");
                setModelSubject("");
                setSelectedConfigId("");
            }
            setError(null);
        }
    }, [open, editingModel]);

    const handleSave = async () => {
        if (!modelName.trim() || !modelSubject.trim() || !emailEditorRef.current) return;

        try {
            setSaving(true);
            setError(null);

            emailEditorRef.current.editor.exportHtml((data) => {
                const { design, html } = data;

                const modelData = {
                    name: modelName.trim(),
                    subject: modelSubject.trim(),
                    content: JSON.stringify(design),
                    htmlContent: html,
                    ...(selectedConfigId && { configId: selectedConfigId }),
                };

                const savePromise = editingModel
                    ? apiClient.put(`/models/${editingModel._id}`, modelData)
                    : apiClient.post("/models", modelData);

                savePromise
                    .then((response) => {
                        onSave(response.data.model);
                        setSaving(false);
                    })
                    .catch((err) => {
                        console.error("Error saving model:", err);
                        setError(err.response?.data?.error || err.response?.data?.message || "Failed to save model");
                        setSaving(false);
                    });
            });
        } catch (err) {
            console.error("Error saving model:", err);
            setError(err.response?.data?.error || "Failed to save model");
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (!saving) {
            onClose();
            setSaving(false);
        }
    };

    const handleApplyDesign = () => {
        const selectedConfig = templateConfigs.find((c) => c._id === selectedConfigId);
        if (selectedConfig && emailEditorRef.current?.editor) {
            const design = createDesignFromConfig(selectedConfig);
            if (design) emailEditorRef.current.editor.loadDesign(design);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
                sx: { display: "flex", flexDirection: "column", height: "100vh" },
            }}
        >
            <EditorHeader
                isEditing={!!editingModel}
                modelName={modelName}
                modelSubject={modelSubject}
                selectedConfigId={selectedConfigId}
                templateConfigs={templateConfigs}
                configsLoading={configsLoading}
                onModelNameChange={setModelName}
                onModelSubjectChange={setModelSubject}
                onConfigChange={setSelectedConfigId}
                onApplyDesign={handleApplyDesign}
                onClose={handleClose}
                error={error}
            />

            <EditorContent
                open={open}
                editingModel={editingModel}
                selectedConfigId={selectedConfigId}
                templateConfigs={templateConfigs}
                emailEditorRef={emailEditorRef}
            />

            <EditorActions
                isEditing={!!editingModel}
                saving={saving}
                canSave={!!modelName.trim() && !!modelSubject.trim()}
                onClose={handleClose}
                onSave={handleSave}
            />
        </Dialog>
    );
};

export default ModelsEditorDialog;