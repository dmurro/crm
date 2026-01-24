/**
 * Spacer Component for GrapesJS Editor
 * Editable: height
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";

export const SpacerComponent = createComponent({
  id: "spacer-component",
  label: "Spacer",
  category: "Layout",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="spacer" style="background-color: transparent;">
      <tr>
        <td style="height: 40px; line-height: 40px; font-size: 1px;">&nbsp;</td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.number("Height (px)", "spacerHeight", 40, 10, 200),
  ],
  attributes: {
    "data-gjs-type": "spacer",
  },
});
