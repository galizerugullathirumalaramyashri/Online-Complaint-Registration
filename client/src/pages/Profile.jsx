import { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "", address: user?.address || "",
    city: user?.city || "", state: user?.state || "", pincode: user?.pincode || "", department: user?.department || ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.put("/users/profile", form);
      setUser(data);
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>Profile</Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={submit} className="form-grid two">
        <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <TextField label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        <TextField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="span-two" />
        <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <TextField label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <Button type="submit" variant="contained" startIcon={<SaveIcon />}>Save Profile</Button>
      </Box>
    </Paper>
  );
}