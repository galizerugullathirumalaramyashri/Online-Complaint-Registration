import { useEffect, useState } from "react";
import { Alert, Box, Button, Divider, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusChip from "../components/StatusChip";

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    const [userRes, agentRes, complaintRes] = await Promise.all([api.get("/users"), api.get("/users/agents"), api.get("/complaints")]);
    setUsers(userRes.data);
    setAgents(agentRes.data);
    setComplaints(complaintRes.data);
  };

  useEffect(() => {
    if (user?.role === "admin") load().catch((err) => setError(err.response?.data?.message || "Could not load admin data"));
  }, [user]);

  const approve = async (id) => {
    await api.put(`/users/agents/${id}/approve`);
    load();
  };

  const assign = async (complaintId) => {
    const agentId = assignments[complaintId];
    if (!agentId) return;
    await api.put(`/complaints/${complaintId}/assign`, { agentId });
    load();
  };

  if (user?.role !== "admin") return <Alert severity="warning">Admin access only.</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Admin Control Panel</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>Users</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {users.map((portalUser) => (
            <Stack key={portalUser._id} direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} gap={2}>
              <Box><Typography fontWeight={700}>{portalUser.name}</Typography><Typography color="text.secondary">{portalUser.email} | {portalUser.phone}</Typography></Box>
              <Typography color="text.secondary">{portalUser.role}</Typography>
            </Stack>
          ))}
          {!users.length && <Typography>No users registered.</Typography>}
        </Stack>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>Officer Approval</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {agents.map((agent) => (
            <Stack key={agent._id} direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} gap={2}>
              <Box><Typography fontWeight={700}>{agent.name}</Typography><Typography color="text.secondary">{agent.email} | {agent.department || "No department"}</Typography></Box>
              {agent.isApproved ? <Button disabled variant="outlined">Approved</Button> : <Button variant="contained" startIcon={<VerifiedUserIcon />} onClick={() => approve(agent._id)}>Approve</Button>}
            </Stack>
          ))}
          {!agents.length && <Typography>No officers registered.</Typography>}
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={800}>Complaint Assignment</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {complaints.map((complaint) => (
            <Stack key={complaint._id} direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} gap={2} className="admin-row">
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" gap={1} alignItems="center"><Typography fontWeight={700}>{complaint.complaintId} - {complaint.category}</Typography><StatusChip status={complaint.status} /></Stack>
                <Typography color="text.secondary">{complaint.department} | Current: {complaint.assignedAgent?.name || "Not assigned"}</Typography>
              </Box>
              <TextField select size="small" label="Assign officer" value={assignments[complaint._id] || ""} onChange={(e) => setAssignments({ ...assignments, [complaint._id]: e.target.value })} sx={{ minWidth: 220 }}>
                {agents.filter((a) => a.isApproved).map((agent) => <MenuItem key={agent._id} value={agent._id}>{agent.name} - {agent.department}</MenuItem>)}
              </TextField>
              <Button variant="contained" startIcon={<AssignmentIndIcon />} onClick={() => assign(complaint._id)}>Assign</Button>
            </Stack>
          ))}
          {!complaints.length && <Typography>No complaints available.</Typography>}
        </Stack>
      </Paper>
    </Box>
  );
}