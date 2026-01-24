/**
 * Quote Component for GrapesJS Editor
 * Editable: text, author, background color, border color, alignment
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const QuoteComponent = createComponent({
  id: "quote-component",
  label: "Quote",
  category: "Content",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="quote" style="background-color: #f5f5f5; padding: 30px;">
      <tr>
        <td style="padding: 20px; border-left: 4px solid ${themeColors.primary}; font-family: Arial, sans-serif;">
          <p data-gjs-editable="true" style="font-size: 18px; font-style: italic; color: #333333; margin: 0 0 10px 0; line-height: 1.6;">
            "The only way to do great work is to love what you do."
          </p>
          <p data-gjs-editable="true" style="font-size: 14px; color: #666666; margin: 0; font-weight: bold;">
            — Steve Jobs
          </p>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Quote Text", "quoteText", "The only way to do great work is to love what you do."),
    commonTraits.text("Author", "author", "Steve Jobs"),
    commonTraits.color("Background Color", "backgroundColor", null, "#f5f5f5"),
    commonTraits.color("Border Color", "borderColor", "primary"),
    commonTraits.number("Border Width (px)", "borderWidth", 4, 1, 10),
    commonTraits.color("Text Color", "textColor", null, "#333333"),
    commonTraits.color("Author Color", "authorColor", null, "#666666"),
    commonTraits.fontSize("fontSize", 18),
    commonTraits.number("Author Font Size", "authorFontSize", 14, 10, 20),
    commonTraits.padding("padding", 30),
    commonTraits.alignment("align", "left"),
  ],
  attributes: {
    "data-gjs-type": "quote",
  },
});
