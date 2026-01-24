// Column definitions for the clients table
export const clientColumns = [
  { id: "CONTACT_ID", label: "Contact ID" },
  { id: "EMAIL", label: "Email" },
  { id: "LASTNAME", label: "Last Name" },
  { id: "FIRSTNAME", label: "First Name" },
  { id: "WHATSAPP", label: "WhatsApp" },
  { id: "LANDLINE_NUMBER", label: "Landline Number" },
  {
    id: "ADDED_TIME",
    label: "Added Time",
    format: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
  },
  {
    id: "MODIFIED_TIME",
    label: "Modified Time",
    format: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
  },
];

// Priority columns for mobile view (most important fields)
export const priorityColumns = ["CONTACT_ID", "EMAIL", "FIRSTNAME", "LASTNAME"];
