/**
 * Product Card Component for GrapesJS Editor
 * Editable: product name, description, price, image, button text, button link
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const ProductCardComponent = createComponent({
  id: "product-card-component",
  label: "Product Card",
  category: "Marketing",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="product-card" style="background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center" style="padding: 10px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 300px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 0;">
                <img src="https://via.placeholder.com/300x200/cccccc/ffffff?text=Product+Image" alt="Product" width="300" style="max-width: 100%; height: auto; display: block;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <h3 data-gjs-editable="true" style="font-size: 24px; font-weight: bold; color: #333333; margin: 0 0 10px 0; font-family: Arial, sans-serif;">
                  Product Name
                </h3>
                <p data-gjs-editable="true" style="font-size: 16px; color: #666666; margin: 0 0 15px 0; line-height: 1.5; font-family: Arial, sans-serif;">
                  Product description goes here. Describe the key features and benefits.
                </p>
                <p data-gjs-editable="true" style="font-size: 28px; font-weight: bold; color: ${themeColors.primary}; margin: 0 0 15px 0; font-family: Arial, sans-serif;">
                  $99.99
                </p>
                <a href="https://example.com" data-gjs-editable="true" style="display: inline-block; background-color: ${themeColors.primary}; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; text-align: center;">
                  Buy Now
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Product Name", "productName", "Product Name"),
    commonTraits.text("Description", "description", "Product description goes here. Describe the key features and benefits."),
    commonTraits.text("Price", "price", "$99.99"),
    commonTraits.url("Product Image URL", "imageUrl", "https://via.placeholder.com/300x200"),
    commonTraits.text("Button Text", "buttonText", "Buy Now"),
    commonTraits.url("Button Link", "buttonLink", "https://example.com"),
    commonTraits.color("Card Background", "cardBackground", null, "#ffffff"),
    commonTraits.color("Border Color", "borderColor", null, "#e0e0e0"),
    commonTraits.color("Product Name Color", "productNameColor", null, "#333333"),
    commonTraits.color("Description Color", "descriptionColor", null, "#666666"),
    commonTraits.color("Price Color", "priceColor", "primary"),
    commonTraits.color("Button Background", "buttonBackground", "primary"),
    commonTraits.color("Button Text Color", "buttonTextColor", null, "#ffffff"),
    commonTraits.fontSize("Product Name Font Size", "productNameFontSize", 24),
    commonTraits.fontSize("Description Font Size", "descriptionFontSize", 16),
    commonTraits.fontSize("Price Font Size", "priceFontSize", 28),
    commonTraits.number("Border Radius", "borderRadius", 8, 0, 50),
    commonTraits.padding("padding", 20),
    commonTraits.alignment("align", "center"),
  ],
  attributes: {
    "data-gjs-type": "product-card",
  },
});
