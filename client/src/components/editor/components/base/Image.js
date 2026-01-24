/**
 * Image Component for GrapesJS Editor
 * Editable: src, alt text, width, alignment, border radius
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";

export const ImageComponent = createComponent({
  id: "image-component",
  label: "Image",
  category: "Base Components",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="image" style="background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center" style="padding: 10px;">
          <img src="https://via.placeholder.com/600x300/2563eb/ffffff?text=Your+Image" alt="Image" width="600" style="max-width: 100%; height: auto; display: block; border-radius: 0px;" />
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.url("Image URL", "imageSrc", "https://via.placeholder.com/600x300"),
    commonTraits.text("Alt Text", "altText", "Image"),
    commonTraits.number("Width (px)", "imageWidth", 600, 100, 1200),
    commonTraits.number("Border Radius", "borderRadius", 0, 0, 50),
    commonTraits.alignment("align", "center"),
    commonTraits.padding("padding", 20),
  ],
  attributes: {
    "data-gjs-type": "image",
  },
});
