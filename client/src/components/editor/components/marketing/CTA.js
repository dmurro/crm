/**
 * CTA (Call to Action) Component for GrapesJS Editor
 * Editable: heading, description, button text, button link, background color, alignment
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const CTAComponent = createComponent({
  id: "cta-component",
  label: "CTA Section",
  category: "Marketing",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="cta" style="background-color: ${themeColors.primary}; padding: 40px 20px;">
      <tr>
        <td align="center" style="padding: 20px;">
          <h2 data-gjs-editable="true" style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0 0 15px 0; font-family: Arial, sans-serif;">
            Get Started Today
          </h2>
          <p data-gjs-editable="true" style="color: #ffffff; font-size: 18px; margin: 0 0 25px 0; font-family: Arial, sans-serif; line-height: 1.5;">
            Join thousands of satisfied customers and start your journey today.
          </p>
          <a href="https://example.com" data-gjs-editable="true" style="display: inline-block; background-color: #ffffff; color: ${themeColors.primary}; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">
            Sign Up Now
          </a>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Heading", "heading", "Get Started Today"),
    commonTraits.text("Description", "description", "Join thousands of satisfied customers and start your journey today."),
    commonTraits.text("Button Text", "buttonText", "Sign Up Now"),
    commonTraits.url("Button Link", "buttonLink", "https://example.com"),
    commonTraits.color("Background Color", "backgroundColor", "primary"),
    commonTraits.color("Heading Color", "headingColor", null, "#ffffff"),
    commonTraits.color("Description Color", "descriptionColor", null, "#ffffff"),
    commonTraits.color("Button Background", "buttonBackground", null, "#ffffff"),
    commonTraits.color("Button Text Color", "buttonTextColor", "primary"),
    commonTraits.fontSize("Heading Font Size", "headingFontSize", 32),
    commonTraits.fontSize("Description Font Size", "descriptionFontSize", 18),
    commonTraits.number("Button Padding (Vertical)", "buttonPaddingY", 15, 5, 30),
    commonTraits.number("Button Padding (Horizontal)", "buttonPaddingX", 40, 10, 100),
    commonTraits.number("Border Radius", "borderRadius", 8, 0, 50),
    commonTraits.padding("padding", 40),
    commonTraits.alignment("align", "center"),
  ],
  attributes: {
    "data-gjs-type": "cta",
  },
});
