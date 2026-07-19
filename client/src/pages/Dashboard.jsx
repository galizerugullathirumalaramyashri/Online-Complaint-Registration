import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import api from "../api/axios";
import ComplaintCard from "../components/ComplaintCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/complaints")
      .then((res) => setComplaints(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load complaints")
      );
  }, []);

  const filtered = useMemo(() => {
    return status === "All"
      ? complaints
      : complaints.filter((item) => item.status === status);
  }, [complaints, status]);

  const counts = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((x) => x.status === "Pending").length,
      assigned: complaints.filter((x) => x.status === "Assigned").length,
      resolved: complaints.filter(
        (x) => x.status === "Resolved" || x.status === "Closed"
      ).length
    };
  }, [complaints]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Dashboard
          </Typography>

          <Typography color="text.secondary">
            Welcome {user?.name}. Role: {user?.role}
          </Typography>
        </Box>

        <TextField
          select
          label="Filter status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          {[
            "All",
            "Pending",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed",
            "Rejected",
            "Reopened"
          ].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Stat label="Total" value={counts.total} />
        <Stat label="Pending" value={counts.pending} />
        <Stat label="Assigned" value={counts.assigned} />
        <Stat label="Resolved / Closed" value={counts.resolved} />
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {filtered.map((complaint) => (
          <Grid item xs={12} md={6} key={complaint._id}>
            <ComplaintCard complaint={complaint} />
          </Grid>
        ))}

        {!filtered.length && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography>No complaints found.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

function Stat({ label, value }) {
  return (
    <Grid item xs={6} md={3}>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
      </Paper>
    </Grid>
  );
}