/**
 * Creates a default email design from a TemplateConfig
 */
export const createDesignFromConfig = (config) => {
    if (!config) return null;
  
    return {
      counters: {
        u_column: 1,
        u_row: 1,
        u_content_text: 1,
        u_content_button: 0,
        u_content_image: 0,
      },
      body: {
        id: "body",
        rows: [
          {
            id: "row_1",
            cells: [1],
            columns: [
              {
                id: "column_1",
                contents: [
                  {
                    id: "text_1",
                    values: {
                      containerPadding: "10px",
                      anchor: "",
                      text: `<div style="font-family: ${config.fontFamily || "Arial, sans-serif"}; font-size: ${config.fontSize || 16}px; line-height: ${config.lineHeight || 24}px; color: ${config.textColor || "#333333"};">
                            <p>Start creating your email template here. This is a text block with your configured colors and fonts.</p>
                          </div>`,
                      color: config.textColor || "#333333",
                      fontFamily: config.fontFamily || "Arial, sans-serif",
                      fontSize: config.fontSize || 16,
                      lineHeight: config.lineHeight || 24,
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: config.backgroundColor || "#ffffff",
                    },
                    type: "text",
                  },
                ],
                values: {
                  backgroundColor: config.backgroundColor || "#ffffff",
                  padding: "10px",
                  border: {},
                  borderRadius: `${config.borderRadius || 4}px`,
                },
              },
            ],
            values: {
              columns: false,
              backgroundColor: config.backgroundColor || "#ffffff",
              columnsBackgroundColor: "",
              padding: "0px",
              anchor: "",
              columnsBorder: "",
              border: {},
              _meta: {
                htmlID: "u_row_1",
                htmlClassNames: "",
              },
            },
          },
        ],
        values: {
          popupPosition: "center",
          popupWidth: "600px",
          popupHeight: "auto",
          borderRadius: "0px",
          contentAlign: "center",
          contentVerticalAlign: "center",
          contentPadding: "0px",
          StripeButton: {},
          backgroundColor: config.backgroundColor || "#ffffff",
          backgroundImage: {
            url: "",
            fullWidth: true,
            repeat: "no-repeat",
            size: "custom",
            position: "center",
          },
          preheaderText: "",
        },
      },
      schemaVersion: 5,
    };
  };