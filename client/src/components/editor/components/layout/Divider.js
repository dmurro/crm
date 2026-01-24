/**
 * Divider Component for GrapesJS Editor
 * Editable: color, thickness, spacing, style
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const DividerComponent = createComponent({
  id: "divider-component",
  label: "Divider",
  category: "Layout",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="divider" style="background-color: #ffffff; padding: 20px 0;">
      <tr>
        <td align="center" style="padding: 20px;">
          <hr style="border: none; border-top: 1px solid ${themeColors.gray.medium}; margin: 0; width: 100%;" />
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.color("Divider Color", "dividerColor", null, themeColors.gray.medium),
    commonTraits.number("Thickness (px)", "thickness", 1, 1, 10),
    commonTraits.number("Spacing (px)", "spacing", 20, 0, 100),
    commonTraits.select("Style", "dividerStyle", ["solid", "dashed", "dotted"], "solid"),
    commonTraits.color("Background Color", "backgroundColor", null, "#ffffff"),
  ],
  attributes: {
    "data-gjs-type": "divider",
  },
});
