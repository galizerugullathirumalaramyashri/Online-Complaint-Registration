import { Chip } from "@mui/material";

const colorMap = {
  Pending: "warning",
  Assigned: "primary",
  "In Progress": "info",
  Resolved: "success",
  Rejected: "error",
  Reopened: "secondary"
};

export default function StatusChip({ status }) {
  return <Chip label={status} color={colorMap[status] || "default"} size="small" />;
}