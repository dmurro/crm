/**
 * Text Component for GrapesJS Editor
 * Editable: content, text color, font size, line height, alignment
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const TextComponent = createComponent({
  id: "text-component",
  label: "Text",
  category: "Base Components",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="text" style="background-color: #ffffff; padding: 20px;">
      <tr>
        <td data-gjs-editable="true" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Text Content", "textContent", "Lorem ipsum dolor sit amet, consectetur adipiscing elit."),
    commonTraits.color("Text Color", "textColor", null, themeColors.text.light.primary),
    commonTraits.fontSize("fontSize", 16),
    commonTraits.number("Line Height", "lineHeight", 24, 12, 48),
    commonTraits.alignment("align", "left"),
    commonTraits.color("Background Color", "backgroundColor", null, "#ffffff"),
    commonTraits.padding("padding", 20),
  ],
  attributes: {
    "data-gjs-type": "text",
  },
});
