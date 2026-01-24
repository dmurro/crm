/**
 * Pricing Table Component for GrapesJS Editor
 * Editable: plan name, price, features list, button text, highlighted option
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";
import { themeColors } from "../../utils/themeColors";

export const PricingTableComponent = createComponent({
  id: "pricing-table-component",
  label: "Pricing Table",
  category: "Marketing",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="pricing-table" style="background-color: #ffffff; padding: 40px 20px;">
      <tr>
        <td align="center" style="padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 800px; margin: 0 auto;">
            <tr>
              <td width="33.33%" style="padding: 20px; vertical-align: top;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 30px;">
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <h3 data-gjs-editable="true" style="font-size: 24px; font-weight: bold; color: #333333; margin: 0 0 10px 0; font-family: Arial, sans-serif;">
                        Basic
                      </h3>
                      <p data-gjs-editable="true" style="font-size: 36px; font-weight: bold; color: ${themeColors.primary}; margin: 0; font-family: Arial, sans-serif;">
                        $29
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0;">
                      <ul data-gjs-editable="true" style="list-style: none; padding: 0; margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 2;">
                        <li>✓ Feature 1</li>
                        <li>✓ Feature 2</li>
                        <li>✓ Feature 3</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 20px;">
                      <a href="https://example.com" data-gjs-editable="true" style="display: inline-block; background-color: ${themeColors.primary}; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">
                        Choose Plan
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
              <td width="33.33%" style="padding: 20px; vertical-align: top;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${themeColors.primary}; border: 2px solid ${themeColors.primary}; border-radius: 8px; padding: 30px;">
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <h3 data-gjs-editable="true" style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 0 0 10px 0; font-family: Arial, sans-serif;">
                        Pro
                      </h3>
                      <p data-gjs-editable="true" style="font-size: 36px; font-weight: bold; color: #ffffff; margin: 0; font-family: Arial, sans-serif;">
                        $99
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0;">
                      <ul data-gjs-editable="true" style="list-style: none; padding: 0; margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #ffffff; line-height: 2;">
                        <li>✓ Feature 1</li>
                        <li>✓ Feature 2</li>
                        <li>✓ Feature 3</li>
                        <li>✓ Feature 4</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 20px;">
                      <a href="https://example.com" data-gjs-editable="true" style="display: inline-block; background-color: #ffffff; color: ${themeColors.primary}; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">
                        Choose Plan
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
              <td width="33.33%" style="padding: 20px; vertical-align: top;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 30px;">
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <h3 data-gjs-editable="true" style="font-size: 24px; font-weight: bold; color: #333333; margin: 0 0 10px 0; font-family: Arial, sans-serif;">
                        Enterprise
                      </h3>
                      <p data-gjs-editable="true" style="font-size: 36px; font-weight: bold; color: ${themeColors.primary}; margin: 0; font-family: Arial, sans-serif;">
                        $199
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0;">
                      <ul data-gjs-editable="true" style="list-style: none; padding: 0; margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 2;">
                        <li>✓ Feature 1</li>
                        <li>✓ Feature 2</li>
                        <li>✓ Feature 3</li>
                        <li>✓ Feature 4</li>
                        <li>✓ Feature 5</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 20px;">
                      <a href="https://example.com" data-gjs-editable="true" style="display: inline-block; background-color: ${themeColors.primary}; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">
                        Choose Plan
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.text("Plan 1 Name", "plan1Name", "Basic"),
    commonTraits.text("Plan 1 Price", "plan1Price", "$29"),
    commonTraits.text("Plan 1 Features", "plan1Features", "✓ Feature 1\n✓ Feature 2\n✓ Feature 3"),
    commonTraits.text("Plan 2 Name", "plan2Name", "Pro"),
    commonTraits.text("Plan 2 Price", "plan2Price", "$99"),
    commonTraits.text("Plan 2 Features", "plan2Features", "✓ Feature 1\n✓ Feature 2\n✓ Feature 3\n✓ Feature 4"),
    commonTraits.text("Plan 3 Name", "plan3Name", "Enterprise"),
    commonTraits.text("Plan 3 Price", "plan3Price", "$199"),
    commonTraits.text("Plan 3 Features", "plan3Features", "✓ Feature 1\n✓ Feature 2\n✓ Feature 3\n✓ Feature 4\n✓ Feature 5"),
    commonTraits.text("Button Text", "buttonText", "Choose Plan"),
    commonTraits.url("Button Link", "buttonLink", "https://example.com"),
    commonTraits.select("Highlighted Plan", "highlightedPlan", ["none", "plan1", "plan2", "plan3"], "plan2"),
    commonTraits.color("Highlighted Background", "highlightedBackground", "primary"),
    commonTraits.color("Normal Background", "normalBackground", null, "#ffffff"),
    commonTraits.color("Border Color", "borderColor", null, "#e0e0e0"),
    commonTraits.number("Border Radius", "borderRadius", 8, 0, 50),
    commonTraits.padding("padding", 40),
  ],
  attributes: {
    "data-gjs-type": "pricing-table",
  },
});
