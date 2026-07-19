import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";

import api from "../api/axios";

const initial = {
  category: "",
  department: "Municipality",
  description: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  urgency: "Medium"
};

export default function NewComplaint() {
  const [form, setForm] = useState(initial);
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (attachment) {
        formData.append("attachment", attachment);
      }

      const { data } = await api.post("/complaints", formData);

      navigate(`/complaints/${data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not submit complaint. Image must be JPG, PNG, or WEBP and below 5 MB."
      );
    }
  };

  return (
    <Paper className="complaint-form-panel" elevation={2}>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ mb: 2, textAlign: "center" }}
      >
        Complaint Register
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} className="form-grid two">
        <TextField
          label="Complaint category"
          required
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          placeholder="Water leakage"
        />

        <TextField
          select
          label="Department"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        >
          {[
            "Municipality",
            "Electricity",
            "Police",
            "Health",
            "Transport"
          ].map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Description"
          required
          multiline
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="span-two"
        />

        <TextField
          label="Address"
          required
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
          className="span-two"
        />

        <TextField
          label="City"
          required
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <TextField
          label="State"
          required
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />

        <TextField
          label="Pincode"
          required
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />

        <TextField
          select
          label="Urgency"
          value={form.urgency}
          onChange={(e) =>
            setForm({ ...form, urgency: e.target.value })
          }
        >
          {["Low", "Medium", "High"].map((urgency) => (
            <MenuItem key={urgency} value={urgency}>
              {urgency}
            </MenuItem>
          ))}
        </TextField>

        <Box className="span-two">
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon />}
          >
            Choose Picture
            <input
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            />
          </Button>

          <Typography sx={{ mt: 1 }} color="text.secondary">
            {attachment
              ? `Selected: ${attachment.name}`
              : "Optional: JPG, PNG, or WEBP image, maximum 5 MB."}
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          startIcon={<SendIcon />}
        >
          Register
        </Button>
      </Box>
    </Paper>
  );
}