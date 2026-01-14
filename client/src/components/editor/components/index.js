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
  "Base Components": [
    HeaderComponent,
    TextComponent,
    ButtonComponent,
    ImageComponent,
    FooterComponent,
  ],
  Layout: [
    DividerComponent,
    SpacerComponent,
    Columns2Component,
    Columns3Component,
    ContainerComponent,
  ],
  Content: [
    QuoteComponent,
    VideoComponent,
    SocialIconsComponent,
  ],
  Marketing: [
    CTAComponent,
    TestimonialComponent,
    ProductCardComponent,
    PricingTableComponent,
  ],
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

    // Register block in BlockManager with traits
    // The traits will be available when the component is added to the canvas
    const blockConfig = {
      label: component.label,
      category: component.category,
      content: component.content,
      attributes: component.attributes || {},
    };

    // Add traits if available
    if (traits.length > 0) {
      blockConfig.activate = true;
      blockConfig.select = true;
    }

    blockManager.add(component.id, blockConfig);

    // Register component type with traits in DomComponents for proper trait editing
    if (traits.length > 0 && component.attributes?.["data-gjs-type"]) {
      const componentType = component.attributes["data-gjs-type"];

      // Register a component type that extends the default table component
      // This allows traits to be properly edited in the right panel
      domComponents.addType(componentType, {
        extend: "table",
        model: {
          defaults: {
            traits: traits,
            ...component.attributes,
          },
        },
      });
    }
  });
};

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
