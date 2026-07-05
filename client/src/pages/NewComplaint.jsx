import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../api/axios";

const initial = { category: "", department: "Municipality", description: "", address: "", city: "", state: "", pincode: "", urgency: "Medium", attachmentUrl: "" };

export default function NewComplaint() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/complaints", form);
      navigate(`/complaints/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit complaint");
    }
  };

  return (
    <Paper className="complaint-form-panel" elevation={2}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 2, textAlign: "center" }}>Complaint Register</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={submit} className="form-grid two">
        <TextField label="Complaint category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Water leakage" />
        <TextField select label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
          {['Municipality', 'Electricity', 'Police', 'Health', 'Transport'].map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </TextField>
        <TextField label="Description" required multiline rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="span-two" />
        <TextField label="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="span-two" />
        <TextField label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <TextField label="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <TextField label="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        <TextField select label="Urgency" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
          {['Low', 'Medium', 'High'].map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
        </TextField>
        <TextField label="Attachment URL" value={form.attachmentUrl} onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })} className="span-two" />
        <Button type="submit" variant="contained" color="success" size="large" startIcon={<SendIcon />}>Register</Button>
      </Box>
    </Paper>
  );
}