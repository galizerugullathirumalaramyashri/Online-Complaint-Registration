import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../context/AuthContext";

const dashboardFor = (user) => user.role === "admin" ? "/admin" : "/dashboard";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(dashboardFor(user));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box className="auth-page">
      <Paper className="auth-panel" elevation={2}>
        <Typography variant="h4" fontWeight={800}>Login For Registering the Complaint</Typography>
        <Typography sx={{ mb: 3, color: "#ccfbf1" }}>Please enter your Credentials!</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} className="form-grid">
          <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" variant="outlined" color="inherit" size="large" startIcon={<LoginIcon />} disabled={loading}>Login</Button>
        </Box>
        <Typography sx={{ mt: 2 }}>New user? <Link to="/register">Create account</Link></Typography>
      </Paper>
    </Box>
  );
}