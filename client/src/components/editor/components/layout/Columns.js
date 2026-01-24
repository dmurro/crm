/**
 * Columns Component for GrapesJS Editor
 * 2-column and 3-column layouts with editable widths
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";

export const Columns2Component = createComponent({
  id: "columns-2-component",
  label: "2 Columns",
  category: "Layout",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="columns-2" style="background-color: #ffffff;">
      <tr>
        <td width="50%" style="padding: 20px; vertical-align: top;">
          <div data-gjs-editable="true" style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
            Column 1 Content
          </div>
        </td>
        <td width="50%" style="padding: 20px; vertical-align: top;">
          <div data-gjs-editable="true" style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
            Column 2 Content
          </div>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.number("Column 1 Width (%)", "column1Width", 50, 10, 90),
    commonTraits.number("Column 2 Width (%)", "column2Width", 50, 10, 90),
    commonTraits.number("Padding (px)", "padding", 20, 0, 50),
    commonTraits.color("Background Color", "backgroundColor", null, "#ffffff"),
  ],
  attributes: {
    "data-gjs-type": "columns-2",
  },
});

export const Columns3Component = createComponent({
  id: "columns-3-component",
  label: "3 Columns",
  category: "Layout",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="columns-3" style="background-color: #ffffff;">
      <tr>
        <td width="33.33%" style="padding: 20px; vertical-align: top;">
          <div data-gjs-editable="true" style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
            Column 1 Content
          </div>
        </td>
        <td width="33.33%" style="padding: 20px; vertical-align: top;">
          <div data-gjs-editable="true" style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
            Column 2 Content
          </div>
        </td>
        <td width="33.33%" style="padding: 20px; vertical-align: top;">
          <div data-gjs-editable="true" style="font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
            Column 3 Content
          </div>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.number("Column 1 Width (%)", "column1Width", 33.33, 10, 50),
    commonTraits.number("Column 2 Width (%)", "column2Width", 33.33, 10, 50),
    commonTraits.number("Column 3 Width (%)", "column3Width", 33.33, 10, 50),
    commonTraits.number("Padding (px)", "padding", 20, 0, 50),
    commonTraits.color("Background Color", "backgroundColor", null, "#ffffff"),
  ],
  attributes: {
    "data-gjs-type": "columns-3",
  },
});
