/**
 * Container Component for GrapesJS Editor
 * Editable: background color, padding, max-width
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const ContainerComponent = createComponent({
  id: "container-component",
  label: "Container",
  category: "Layout",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="container" style="background-color: ${themeColors.background.light}; padding: 30px;">
      <tr>
        <td align="center" style="max-width: 600px; margin: 0 auto;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
            <tr>
              <td data-gjs-editable="true" style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                Container Content
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.color("Background Color", "backgroundColor", null, themeColors.background.light),
    commonTraits.number("Padding (px)", "padding", 30, 0, 100),
    commonTraits.number("Max Width (px)", "maxWidth", 600, 300, 1200),
    commonTraits.color("Inner Background", "innerBackground", null, "#ffffff"),
    commonTraits.number("Inner Padding (px)", "innerPadding", 20, 0, 50),
  ],
  attributes: {
    "data-gjs-type": "container",
  },
});
