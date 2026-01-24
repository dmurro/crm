/**
 * Footer Component for GrapesJS Editor
 * Editable: text, background color, text color, padding
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const FooterComponent = createComponent({
  id: "footer-component",
  label: "Footer",
  category: "Base Components",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="footer" style="background-color: #1e293b; padding: 30px 20px;">
      <tr>
        <td align="center" style="padding: 10px;">
          <p data-gjs-editable="true" style="color: #ffffff; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
            © 2024 Your Company. All rights reserved.
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 5px;">
          <p data-gjs-editable="true" style="color: #cbd5e1; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">
            123 Street Name, City, Country
          </p>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Copyright Text", "copyrightText", "© 2024 Your Company. All rights reserved."),
    commonTraits.text("Address Text", "addressText", "123 Street Name, City, Country"),
    commonTraits.color("Background Color", "backgroundColor", null, "#1e293b"),
    commonTraits.color("Text Color", "textColor", null, "#ffffff"),
    commonTraits.color("Secondary Text Color", "secondaryTextColor", null, "#cbd5e1"),
    commonTraits.number("Font Size (Main)", "fontSize", 14, 10, 20),
    commonTraits.number("Font Size (Secondary)", "fontSizeSecondary", 12, 8, 16),
    commonTraits.padding("padding", 30),
  ],
  attributes: {
    "data-gjs-type": "footer",
  },
});
