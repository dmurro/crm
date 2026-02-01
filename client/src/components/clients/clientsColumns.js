// Helpers for formatting
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");
const formatBool = (v) => (v === true ? "Yes" : v === false ? "No" : "—");

// Column definitions for the clients table (matches server client model)
export const clientColumns = [
  { id: "email", label: "Email" },
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "phone", label: "Phone" },
  { id: "status", label: "Status" },
  { id: "points", label: "Points" },
  { id: "visits", label: "Visits" },
  { id: "source", label: "Source" },
  { id: "channel", label: "Channel" },
  { id: "consent", label: "Consent", format: formatBool },
  { id: "creditBalance", label: "Credit Balance" },
  { id: "totalAmountSpent", label: "Total Spent" },
  { id: "memberSince", label: "Member Since", format: formatDate },
  { id: "lastPurchase", label: "Last Purchase", format: formatDate },
  { id: "customerId", label: "Customer ID" },
  { id: "comment", label: "Comment" },
];

// Priority columns for mobile view (most important fields)
export const priorityColumns = ["email", "firstName", "lastName", "phone", "status", "points"];

/** Get display value for a cell (handles null/empty and uses column format) */
export const getDisplayValue = (client, column) => {
  const v = client[column.id];
  if (column.format) return column.format(v);
  if (v == null || v === "") return "—";
  return v;
};
