import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import api from "../api/axios";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/reports/summary")
      .then((response) => setReport(response.data))
      .catch((err) => {
        setError(
          err.response?.data?.message || "Could not load reports"
        );
      });
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!report) {
    return <Typography>Loading reports...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Complaint Reports
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <StatCard label="Total Complaints" value={report.totalComplaints} />
        <StatCard label="Pending" value={report.pendingCount} />
        <StatCard label="Resolved" value={report.statusCounts.Resolved} />
        <StatCard label="Closed" value={report.statusCounts.Closed} />
        <StatCard
          label="Average Resolution Time"
          value={`${report.averageResolutionHours} hours`}
        />
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Complaints by Status
            </Typography>

            <Stack spacing={1}>
              {Object.entries(report.statusCounts).map(([status, count]) => (
                <Stack
                  key={status}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>{status}</Typography>
                  <Typography fontWeight={700}>{count}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Complaints by Category
            </Typography>

            <Stack spacing={1}>
              {report.byCategory.map((item) => (
                <Stack
                  key={item._id}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>{item._id}</Typography>
                  <Typography fontWeight={700}>{item.count}</Typography>
                </Stack>
              ))}

              {!report.byCategory.length && (
                <Typography color="text.secondary">
                  No complaint data yet.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Department Performance
            </Typography>

            <Stack spacing={1}>
              {report.byDepartment.map((item) => (
                <Stack
                  key={item._id}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>{item._id}</Typography>
                  <Typography fontWeight={700}>
                    {item.count} complaint(s)
                  </Typography>
                </Stack>
              ))}

              {!report.byDepartment.length && (
                <Typography color="text.secondary">
                  No department data yet.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function StatCard({ label, value }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
      </Paper>
    </Grid>
  );
}