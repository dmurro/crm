/**
 * Component Registry for GrapesJS Editor
 * Centralized export of all components organized by category
 */

// Base Components
import { HeaderComponent } from "./base/Header";
import { TextComponent } from "./base/Text";
import { ButtonComponent } from "./base/Button";
import { ImageComponent } from "./base/Image";
import { FooterComponent } from "./base/Footer";

// Layout Components
import { DividerComponent } from "./layout/Divider";
import { SpacerComponent } from "./layout/Spacer";
import { Columns2Component, Columns3Component } from "./layout/Columns";
import { ContainerComponent } from "./layout/Container";

// Content Components
import { QuoteComponent } from "./content/Quote";
import { VideoComponent } from "./content/Video";
import { SocialIconsComponent } from "./content/SocialIcons";

// Marketing Components
import { CTAComponent } from "./marketing/CTA";
import { TestimonialComponent } from "./marketing/Testimonial";
import { ProductCardComponent } from "./marketing/ProductCard";
import { PricingTableComponent } from "./marketing/PricingTable";

/**
 * All components organized by category
 */
export const componentsByCategory = {
  "Base Components": [HeaderComponent, TextComponent, ButtonComponent, ImageComponent, FooterComponent],
  Layout: [DividerComponent, SpacerComponent, Columns2Component, Columns3Component, ContainerComponent],
  Content: [QuoteComponent, VideoComponent, SocialIconsComponent],
  Marketing: [CTAComponent, TestimonialComponent, ProductCardComponent, PricingTableComponent],
};

/**
 * Flat array of all components
 */
export const allComponents = Object.values(componentsByCategory).flat();

/**
 * Register all components with GrapesJS BlockManager
 * Traits are registered via the block definition and will be available in the editor
 * @param {Object} editor - GrapesJS editor instance
 */
export const registerComponents = (editor) => {
  const blockManager = editor.BlockManager;
  const domComponents = editor.DomComponents;

  allComponents.forEach((component) => {
    // Prepare traits for component registration
    const traits = component.traits
      ? component.traits.map((trait) => {
          // Ensure trait has all required properties
          const traitDef = {
            type: trait.type || "text",
            label: trait.label || "",
            name: trait.name || "",
            default: trait.default !== undefined ? trait.default : "",
            changeProp: trait.changeProp !== undefined ? trait.changeProp : 1,
          };

          // Add options for select type
          if (trait.type === "select" && trait.options) {
            traitDef.options = trait.options;
          }

          // Add attributes for number/range types
          if ((trait.type === "number" || trait.type === "range") && trait.attributes) {
            traitDef.attributes = trait.attributes;
          }

          // Add placeholder for text/url types
          if ((trait.type === "text" || trait.type === "url") && trait.placeholder) {
            traitDef.placeholder = trait.placeholder;
          }

          return traitDef;
        })
      : [];

    // Register block in BlockManager
    blockManager.add(component.id, {
      label: component.label,
      category: component.category,
      content: component.content,
      attributes: component.attributes || {},
    });

    // Register component type with traits in DomComponents
    // This is crucial for traits to appear in the right panel
    if (traits.length > 0) {
      const componentType = component.attributes?.["data-gjs-type"] || component.id;

      // Create a custom component type that extends table (for email compatibility)
      domComponents.addType(componentType, {
        extend: "table",
        model: {
          defaults: {
            traits: traits,
            ...component.attributes,
            selectable: true,
            editable: true,
            draggable: true,
            droppable: true,
          },
          init() {
            // Set default trait values
            traits.forEach((trait) => {
              if (trait.default !== undefined && trait.default !== null && trait.default !== "") {
                this.set(trait.name, trait.default);
              }
            });

            // Listen to trait changes and update component
            this.on("change", () => {
              traits.forEach((trait) => {
                const value = this.get(trait.name);
                if (value !== undefined && value !== null && value !== "") {
                  this.updateTraitValue(trait, value);
                }
              });
            });

            // Also listen to component:update to sync traits with inline edits
            this.on("component:update", () => {
              // Sync text traits with editable content
              const view = this.getView();
              if (view && view.el) {
                const editableEls = view.el.querySelectorAll("[data-gjs-editable]");
                editableEls.forEach((el) => {
                  const textTrait = traits.find((t) => (t.name.includes("text") || t.name.includes("Text") || t.name.includes("Content")) && t.type === "text");
                  if (textTrait && el.textContent) {
                    this.set(textTrait.name, el.textContent.trim());
                  }
                });
              }
            });
          },
          updateTraitValue(trait, value) {
            const view = this.getView();
            if (!view || !view.el) return;

            updateComponentFromTrait(view.el, trait, value);

            // Trigger component update to refresh the view
            this.trigger("component:update");
          },
        },
        view: {
          // Ensure editable elements are properly initialized
          onRender() {
            const editableEls = this.el.querySelectorAll("[data-gjs-editable]");
            editableEls.forEach((el) => {
              // Make sure the element is editable
              el.setAttribute("contenteditable", "true");
            });
          },
        },
      });
    }
  });
};

/**
 * Helper function to update component DOM based on trait value
 */
function updateComponentFromTrait(el, trait, value) {
  if (!el) return;

  const traitName = trait.name;
  const traitType = trait.type;

  // For table-based email components, we need to update the right elements
  const isTable = el.tagName === "TABLE";
  const table = isTable ? el : el.closest("table");
  const tds = table ? table.querySelectorAll("td") : [];
  const firstTd = tds[0] || el;

  switch (traitType) {
    case "color":
      if (traitName.includes("background") || traitName.includes("Background")) {
        // Update table background
        if (table) {
          table.style.backgroundColor = value;
        }
        // Update first td background
        if (firstTd) {
          firstTd.style.backgroundColor = value;
        }
      } else if (traitName.includes("text") || traitName.includes("Text") || traitName === "textColor") {
        // Update text color in all tds
        tds.forEach((td) => {
          td.style.color = value;
        });
        // Update h1, h2, h3, p, span colors
        const textElements = table ? table.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, a") : [];
        textElements.forEach((elem) => {
          elem.style.color = value;
        });
      } else if (traitName.includes("border") || traitName === "borderColor") {
        const hr = table ? table.querySelector("hr") : null;
        if (hr) {
          hr.style.borderColor = value;
        }
      }
      break;

    case "number":
    case "range":
      if (traitName.includes("font") || traitName === "fontSize") {
        const textElements = table ? table.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, td") : [];
        textElements.forEach((elem) => {
          elem.style.fontSize = `${value}px`;
        });
      } else if (traitName.includes("padding") || traitName === "padding") {
        if (table) {
          table.style.padding = `${value}px`;
        }
        tds.forEach((td) => {
          td.style.padding = `${value}px`;
        });
      } else if (traitName.includes("height") || traitName === "spacerHeight") {
        if (firstTd) {
          firstTd.style.height = `${value}px`;
          firstTd.style.lineHeight = `${value}px`;
        }
      } else if (traitName.includes("width") || traitName === "imageWidth" || traitName === "videoWidth") {
        const img = table ? table.querySelector("img") : null;
        if (img) {
          img.width = value;
          img.style.width = `${value}px`;
          img.setAttribute("width", value);
        }
      } else if (traitName.includes("border") || traitName === "borderRadius") {
        const img = table ? table.querySelector("img") : null;
        const a = table ? table.querySelector("a") : null;
        if (img) {
          img.style.borderRadius = `${value}px`;
        }
        if (a) {
          a.style.borderRadius = `${value}px`;
        }
      } else if (traitName.includes("thickness") || traitName === "thickness") {
        const hr = table ? table.querySelector("hr") : null;
        if (hr) {
          hr.style.borderTopWidth = `${value}px`;
        }
      } else if (traitName === "lineHeight") {
        const textElements = table ? table.querySelectorAll("p, td, span") : [];
        textElements.forEach((elem) => {
          elem.style.lineHeight = `${value}px`;
        });
      }
      break;

    case "select":
      if (traitName === "align" || traitName.includes("alignment")) {
        tds.forEach((td) => {
          td.align = value;
          td.style.textAlign = value;
        });
        if (table) {
          const textElements = table.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
          textElements.forEach((elem) => {
            elem.style.textAlign = value;
          });
        }
      } else if (traitName === "dividerStyle") {
        const hr = table ? table.querySelector("hr") : null;
        if (hr) {
          hr.style.borderTopStyle = value;
        }
      }
      break;

    case "text":
      // Text traits update editable elements
      if (traitName.includes("text") || traitName.includes("Text") || traitName.includes("Content")) {
        // Update all editable elements that match the trait
        const editableEls = table ? table.querySelectorAll("[data-gjs-editable]") : [];
        if (editableEls.length > 0) {
          // For header text, update h1
          if (traitName === "headerText") {
            const h1 = table ? table.querySelector("h1") : null;
            if (h1) h1.textContent = value;
          }
          // For button text, update the link text
          else if (traitName === "buttonText") {
            const link = table ? table.querySelector("a") : null;
            if (link) link.textContent = value;
          }
          // For quote text, update the first paragraph
          else if (traitName === "quoteText") {
            const p = table ? table.querySelector("p") : null;
            if (p) p.textContent = `"${value}"`;
          }
          // For author, update the second paragraph or author element
          else if (traitName === "author") {
            const ps = table ? table.querySelectorAll("p") : [];
            if (ps.length > 1) ps[1].textContent = `— ${value}`;
          }
          // For general text content, update the first editable element
          else if (traitName === "textContent") {
            editableEls[0].textContent = value;
          }
          // For other text traits, try to find matching element
          else {
            editableEls[0].textContent = value;
          }
        }
      } else if (traitName.includes("url") || traitName.includes("Url") || traitName.includes("URL") || traitName.includes("Link")) {
        const link = table ? table.querySelector("a") : null;
        if (link) {
          link.href = value;
          link.setAttribute("href", value);
        }
        const img = table ? table.querySelector("img") : null;
        if (img && (traitName.includes("image") || traitName.includes("Image") || traitName.includes("src") || traitName === "imageSrc" || traitName === "avatarUrl" || traitName === "thumbnailUrl")) {
          img.src = value;
          img.setAttribute("src", value);
        }
        // For video URL
        if (traitName === "videoUrl") {
          const videoLink = table ? table.querySelector("a[href*='youtube']") || table.querySelector("a[href*='vimeo']") : null;
          if (videoLink) {
            videoLink.href = value;
            videoLink.setAttribute("href", value);
          }
        }
      } else if (traitName === "altText") {
        const img = table ? table.querySelector("img") : null;
        if (img) {
          img.alt = value;
          img.setAttribute("alt", value);
        }
      }
      break;
  }
}

/**
 * Get component by ID
 */
export const getComponentById = (id) => {
  return allComponents.find((comp) => comp.id === id);
};

/**
 * Get components by category
 */
export const getComponentsByCategory = (category) => {
  return componentsByCategory[category] || [];
};

export default {
  componentsByCategory,
  allComponents,
  registerComponents,
  getComponentById,
  getComponentsByCategory,
};
