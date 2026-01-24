/**
 * Social Icons Component for GrapesJS Editor
 * Editable: platform selection, icon size, color, spacing
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const SocialIconsComponent = createComponent({
  id: "social-icons-component",
  label: "Social Icons",
  category: "Content",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="social-icons" style="background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center" style="padding: 20px;">
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 10px;">
                <a href="https://facebook.com" style="display: inline-block; width: 40px; height: 40px; background-color: ${themeColors.primary}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                  <span style="color: #ffffff; font-size: 20px;">f</span>
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://twitter.com" style="display: inline-block; width: 40px; height: 40px; background-color: ${themeColors.primary}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                  <span style="color: #ffffff; font-size: 20px;">t</span>
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://instagram.com" style="display: inline-block; width: 40px; height: 40px; background-color: ${themeColors.primary}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                  <span style="color: #ffffff; font-size: 20px;">i</span>
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://linkedin.com" style="display: inline-block; width: 40px; height: 40px; background-color: ${themeColors.primary}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                  <span style="color: #ffffff; font-size: 20px;">in</span>
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.select("Icon Style", "iconStyle", ["circle", "square", "rounded"], "circle"),
    commonTraits.number("Icon Size (px)", "iconSize", 40, 20, 80),
    commonTraits.color("Icon Color", "iconColor", "primary"),
    commonTraits.number("Spacing (px)", "iconSpacing", 10, 0, 30),
    commonTraits.url("Facebook URL", "facebookUrl", "https://facebook.com"),
    commonTraits.url("Twitter URL", "twitterUrl", "https://twitter.com"),
    commonTraits.url("Instagram URL", "instagramUrl", "https://instagram.com"),
    commonTraits.url("LinkedIn URL", "linkedinUrl", "https://linkedin.com"),
    commonTraits.alignment("align", "center"),
    commonTraits.padding("padding", 20),
  ],
  attributes: {
    "data-gjs-type": "social-icons",
  },
});
