/**
 * Header Component for GrapesJS Editor
 * Editable: text, background color, text color, font size, padding
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const HeaderComponent = createComponent({
  id: "header-component",
  label: "Header",
  category: "Base Components",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="header" style="background-color: ${themeColors.primary}; padding: 20px 0;">
      <tr>
        <td align="center" style="padding: 20px;">
          <h1 data-gjs-editable="true" style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; font-family: Arial, sans-serif;">
            Your Company Name
          </h1>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Header Text", "headerText", "Your Company Name"),
    commonTraits.color("Background Color", "backgroundColor", "primary"),
    commonTraits.color("Text Color", "textColor", null, "#ffffff"),
    commonTraits.fontSize("fontSize", 32),
    commonTraits.padding("padding", 20),
    commonTraits.alignment("align", "center"),
  ],
  attributes: {
    "data-gjs-type": "header",
  },
});
