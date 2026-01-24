/**
 * Video Component for GrapesJS Editor
 * Editable: video URL, thumbnail, width
 */

import { createComponent, commonTraits } from "../../utils/componentFactory";

export const VideoComponent = createComponent({
  id: "video-component",
  label: "Video",
  category: "Content",
  content: `
    <table width="100%" cellpadding="0" cellspacing="0" data-gjs-type="video" style="background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center" style="padding: 10px;">
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="display: block; position: relative;">
            <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Video Thumbnail" width="600" style="max-width: 100%; height: auto; display: block; border-radius: 8px;" />
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255, 0, 0, 0.8); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; margin-left: 4px;">▶</span>
            </div>
          </a>
        </td>
      </tr>
    </table>
  `,
  traits: [
    commonTraits.url("Video URL (YouTube/Vimeo)", "videoUrl", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    commonTraits.url("Thumbnail Image URL", "thumbnailUrl", ""),
    commonTraits.number("Width (px)", "videoWidth", 600, 200, 1200),
    commonTraits.number("Border Radius", "borderRadius", 8, 0, 50),
    commonTraits.alignment("align", "center"),
    commonTraits.padding("padding", 20),
  ],
  attributes: {
    "data-gjs-type": "video",
  },
});
