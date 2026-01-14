/**
 * Component Factory for GrapesJS
 * Standardizes component creation with traits and default values
 */

import { themeColors, getDefaultColor } from "./themeColors";

/**
 * Create a component definition for GrapesJS BlockManager
 * @param {Object} config - Component configuration
 * @param {string} config.id - Unique component ID
 * @param {string} config.label - Display label
 * @param {string} config.category - Category name
 * @param {string} config.content - HTML content
 * @param {Array} config.traits - Array of trait definitions
 * @param {Object} config.attributes - Additional component attributes
 * @returns {Object} GrapesJS component definition
 */
export const createComponent = ({ id, label, category, content, traits = [], attributes = {} }) => {
  return {
    id,
    label,
    category,
    content,
    attributes,
    traits: traits.map((trait) => {
      // Set default value if not provided
      if (trait.default === undefined && trait.type === "color") {
        trait.default = getDefaultColor(trait.colorType || "primary");
      }
      return trait;
    }),
  };
};

/**
 * Common trait definitions that can be reused
 */
export const commonTraits = {
  // Text content
  text: (label = "Text", name = "text", defaultText = "") => ({
    type: "text",
    label,
    name,
    default: defaultText,
    changeProp: 1,
  }),

  // Color picker
  color: (label, name, colorType = "primary", defaultColor = null) => ({
    type: "color",
    label,
    name,
    default: defaultColor || getDefaultColor(colorType),
    changeProp: 1,
  }),

  // Number input
  number: (label, name, defaultValue = 0, min = 0, max = 1000) => ({
    type: "number",
    label,
    name,
    default: defaultValue,
    changeProp: 1,
    attributes: {
      min,
      max,
      step: 1,
    },
  }),

  // Select dropdown
  select: (label, name, options = [], defaultValue = "") => ({
    type: "select",
    label,
    name,
    default: defaultValue,
    options: options.map((opt) => (typeof opt === "string" ? { value: opt, name: opt } : opt)),
    changeProp: 1,
  }),

  // Range slider
  range: (label, name, defaultValue = 0, min = 0, max = 100) => ({
    type: "range",
    label,
    name,
    default: defaultValue,
    changeProp: 1,
    attributes: {
      min,
      max,
      step: 1,
    },
  }),

  // URL input
  url: (label, name, defaultUrl = "") => ({
    type: "text",
    label,
    name,
    default: defaultUrl,
    placeholder: "https://example.com",
    changeProp: 1,
  }),

  // Alignment
  alignment: (name = "align", defaultValue = "center") => ({
    type: "select",
    label: "Alignment",
    name,
    default: defaultValue,
    options: [
      { value: "left", name: "Left" },
      { value: "center", name: "Center" },
      { value: "right", name: "Right" },
    ],
    changeProp: 1,
  }),

  // Font size
  fontSize: (name = "fontSize", defaultValue = 16) => ({
    type: "number",
    label: "Font Size (px)",
    name,
    default: defaultValue,
    changeProp: 1,
    attributes: {
      min: 8,
      max: 72,
      step: 1,
    },
  }),

  // Padding
  padding: (name = "padding", defaultValue = 20) => ({
    type: "number",
    label: "Padding (px)",
    name,
    default: defaultValue,
    changeProp: 1,
    attributes: {
      min: 0,
      max: 100,
      step: 5,
    },
  }),
};

/**
 * Helper to update component HTML based on trait values
 * This is used in the component's view update logic
 */
export const updateComponentStyle = (component, traitName, value) => {
  const view = component.getView();
  const el = view.el;

  // Common style updates based on trait name
  switch (traitName) {
    case "backgroundColor":
      el.style.backgroundColor = value;
      break;
    case "textColor":
    case "color":
      el.style.color = value;
      break;
    case "fontSize":
      el.style.fontSize = `${value}px`;
      break;
    case "padding":
      el.style.padding = `${value}px`;
      break;
    case "align":
      el.style.textAlign = value;
      break;
    default:
      // For custom attributes, update via data attributes
      el.setAttribute(`data-${traitName}`, value);
  }
};

/**
 * Create a trait that updates component content
 */
export const createContentTrait = (label, name, selector, defaultText = "") => {
  return {
    type: "text",
    label,
    name,
    default: defaultText,
    changeProp: 1,
    // Custom update function
    update: ({ component, trait }) => {
      const view = component.getView();
      const el = view.el.querySelector(selector);
      if (el) {
        el.textContent = trait.get("value") || defaultText;
      }
    },
  };
};
