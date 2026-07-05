import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    department: "",
    adminCode: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await register(form);
      setSuccess(data.message || "Registration successful. Please login.");
      window.alert("record submitted");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box className="auth-page">
      <Paper className="auth-panel wide" elevation={2}>
        <Typography variant="h4" fontWeight={800}>
          SignUp For Registering the Complaint
        </Typography>

        <Typography sx={{ mb: 3, color: "#ccfbf1" }}>
          Please enter your Details
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={submit} className="form-grid two">
          <TextField
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <TextField
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value="user">Customer</MenuItem>
            <MenuItem value="agent">Officer / Agent</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {form.role === "agent" && (
            <TextField
              label="Department"
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Municipality, Police, Electricity"
            />
          )}

          {form.role === "admin" && (
            <TextField
              label="Admin registration code"
              type="password"
              required
              value={form.adminCode}
              onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
            />
          )}

          <Button
            type="submit"
            variant="outlined"
            color="inherit"
            size="large"
            startIcon={<PersonAddAltIcon />}
            disabled={loading}
          >
            Register
          </Button>
        </Box>

        <Typography sx={{ mt: 2 }}>
          Already registered? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}