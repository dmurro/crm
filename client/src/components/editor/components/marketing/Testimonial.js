/**
 * Testimonial Component for GrapesJS Editor
 * Editable: quote text, author name, author role, avatar image, background color
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const TestimonialComponent = createComponent({
  id: "testimonial-component",
  label: "Testimonial",
  category: "Marketing",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="testimonial" style="background-color: #f5f5f5; padding: 40px 20px;">
      <tr>
        <td align="center" style="padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <img src="https://via.placeholder.com/80x80/cccccc/ffffff?text=Avatar" alt="Avatar" width="80" height="80" style="border-radius: 50%; display: block; margin: 0 auto;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 15px;">
                <p data-gjs-editable="true" style="font-size: 18px; font-style: italic; color: #333333; margin: 0; line-height: 1.6; font-family: Arial, sans-serif;">
                  "This product has completely transformed how I work. Highly recommended!"
                </p>
              </td>
            </tr>
            <tr>
              <td align="center">
                <p data-gjs-editable="true" style="font-size: 16px; font-weight: bold; color: #333333; margin: 5px 0 0 0; font-family: Arial, sans-serif;">
                  John Doe
                </p>
                <p data-gjs-editable="true" style="font-size: 14px; color: #666666; margin: 5px 0 0 0; font-family: Arial, sans-serif;">
                  CEO, Company Name
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Quote Text", "quoteText", "This product has completely transformed how I work. Highly recommended!"),
    commonTraits.text("Author Name", "authorName", "John Doe"),
    commonTraits.text("Author Role", "authorRole", "CEO, Company Name"),
    commonTraits.url("Avatar Image URL", "avatarUrl", "https://via.placeholder.com/80x80"),
    commonTraits.number("Avatar Size (px)", "avatarSize", 80, 40, 150),
    commonTraits.color("Background Color", "backgroundColor", null, "#f5f5f5"),
    commonTraits.color("Card Background", "cardBackground", null, "#ffffff"),
    commonTraits.color("Quote Color", "quoteColor", null, "#333333"),
    commonTraits.color("Author Name Color", "authorNameColor", null, "#333333"),
    commonTraits.color("Author Role Color", "authorRoleColor", null, "#666666"),
    commonTraits.fontSize("Quote Font Size", "quoteFontSize", 18),
    commonTraits.fontSize("Author Font Size", "authorFontSize", 16),
    commonTraits.number("Border Radius", "borderRadius", 8, 0, 50),
    commonTraits.padding("padding", 40),
    commonTraits.alignment("align", "center"),
  ],
  attributes: {
    "data-gjs-type": "testimonial",
  },
});
