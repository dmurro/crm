import { useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import EmailEditor from "react-email-editor";
import apiClient from "../../services/api";
import { createDesignFromConfig } from "./utils";

const EditorContent = ({
    open,
    editingModel,
    selectedConfigId,
    templateConfigs,
    emailEditorRef,
}) => {
    const onEditorReady = (unlayer) => {
        console.log("=== EMAIL EDITOR READY ===");

        setTimeout(() => {
            const editor = unlayer || window.unlayer || emailEditorRef.current?.editor;

            if (editor && typeof editor.registerCallback === "function") {
                console.log("Registering image callback...");

                editor.registerCallback("image", function (file, done) {
                    console.log("🎉 IMAGE CALLBACK TRIGGERED!", file);

                    const formData = new FormData();
                    formData.append("file", file.attachments[0]);

                    apiClient
                        .post("/uploads/images", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        })
                        .then((response) => {
                            console.log("Upload response:", response.data);
                            if (response.data?.url) {
                                done({ progress: 100, url: response.data.url });
                            } else {
                                throw new Error("No URL in response");
                            }
                        })
                        .catch((err) => {
                            console.error("Upload error:", err);
                            done({ progress: 0 });
                        });
                });

                console.log("✅ Callback registered successfully");
            }

            loadDesignIfNeeded();
        }, 1000);
    };

    const loadDesignIfNeeded = useCallback(() => {
        if (!emailEditorRef.current || !editingModel || !editingModel.content) return;

        try {
            let design;
            try {
                design = JSON.parse(editingModel.content);
            } catch (e) {
                console.warn("Old HTML format detected, starting with empty design");
                return;
            }

            if (design) {
                emailEditorRef.current.editor.loadDesign(design);
            }
        } catch (error) {
            console.error("Error loading design:", error);
        }
    }, [editingModel, emailEditorRef]);

    // Apply TemplateConfig design for new models
    useEffect(() => {
        if (!open || !emailEditorRef.current) return;
        if (!editingModel && selectedConfigId) {
            const selectedConfig = templateConfigs.find((c) => c._id === selectedConfigId);
            if (selectedConfig) {
                const timer = setTimeout(() => {
                    const design = createDesignFromConfig(selectedConfig);
                    if (design && emailEditorRef.current?.editor) {
                        emailEditorRef.current.editor.loadDesign(design);
                        console.log("Applied design from TemplateConfig:", selectedConfig.name);
                    }
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [selectedConfigId, open, editingModel, templateConfigs, emailEditorRef]);

    // Load design when editingModel changes
    useEffect(() => {
        if (open && emailEditorRef.current && editingModel) {
            const timer = setTimeout(() => {
                loadDesignIfNeeded();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [editingModel, open, loadDesignIfNeeded, emailEditorRef]);

    const getEditorOptions = () => {
        const selectedConfig = templateConfigs.find((c) => c._id === selectedConfigId);

        return {
            appearance: {
                theme: "modern_light",
                panels: { tools: { dock: "left" } },
            },
            displayMode: "email",
            features: {
                colorPicker: {
                    presets: selectedConfig
                        ? [
                            selectedConfig.primaryColor,
                            selectedConfig.secondaryColor,
                            selectedConfig.buttonColor,
                            selectedConfig.textColor,
                            selectedConfig.backgroundColor,
                            selectedConfig.linkColor,
                        ].filter(Boolean)
                        : undefined,
                },
            },
            fonts: {
                showDefaultFonts: true,
                customFonts: selectedConfig?.fontFamily
                    ? [
                        {
                            label: selectedConfig.fontFamily.split(",")[0],
                            value: selectedConfig.fontFamily,
                        },
                    ]
                    : [],
            },
        };
    };

    return (
        <Box
            sx={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                "& .email-editor": { height: "100%", width: "100%" },
            }}
        >
            {open && (
                <EmailEditor
                    ref={emailEditorRef}
                    onReady={onEditorReady}
                    projectId={123456}
                    style={{ height: "100%", width: "100%" }}
                    options={getEditorOptions()}
                />
            )}
        </Box>
    );
};

export default EditorContent;