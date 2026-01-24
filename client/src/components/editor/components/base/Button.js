/**
 * Button Component for GrapesJS Editor
 * Editable: text, link URL, background color, text color, size, border radius
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const ButtonComponent = createComponent({
  id: "button-component",
  label: "Button",
  category: "Base Components",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="button" style="background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center" style="padding: 20px;">
          <a href="https://example.com" data-gjs-editable="true" style="display: inline-block; background-color: ${themeColors.primary}; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">
            Click Here
          </a>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Button Text", "buttonText", "Click Here"),
    commonTraits.url("Link URL", "linkUrl", "https://example.com"),
    commonTraits.color("Background Color", "backgroundColor", "primary"),
    commonTraits.color("Text Color", "textColor", null, "#ffffff"),
    commonTraits.number("Font Size", "fontSize", 16, 10, 24),
    commonTraits.number("Padding (Vertical)", "paddingY", 15, 5, 50),
    commonTraits.number("Padding (Horizontal)", "paddingX", 30, 10, 100),
    commonTraits.number("Border Radius", "borderRadius", 8, 0, 50),
    commonTraits.alignment("align", "center"),
  ],
  attributes: {
    "data-gjs-type": "button",
  },
});
