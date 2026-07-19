import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";

import api from "../api/axios";
import StatusChip from "../components/StatusChip";
import { useAuth } from "../context/AuthContext";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [complaintRes, messageRes] = await Promise.all([
      api.get(`/complaints/${id}`),
      api.get(`/messages/${id}`)
    ]);

    setComplaint(complaintRes.data);
    setStatus(complaintRes.data.status);
    setMessages(messageRes.data);
  };

  useEffect(() => {
    load().catch((err) => {
      setError(err.response?.data?.message || "Could not load complaint");
    });
  }, [id]);

  const updateStatus = async () => {
    setError("");

    try {
      const { data } = await api.put(`/complaints/${id}/status`, {
        status
      });

      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    setError("");

    try {
      const { data } = await api.post(`/messages/${id}`, {
        text
      });

      setMessages([...messages, data]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message");
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!complaint) {
    return <Typography>Loading...</Typography>;
  }

  const pictureUrl = complaint.attachmentUrl
    ? complaint.attachmentUrl.startsWith("http")
      ? complaint.attachmentUrl
      : `${SERVER_URL}${complaint.attachmentUrl}`
    : null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            gap={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {complaint.category}
              </Typography>

              <Typography color="text.secondary">
                {complaint.complaintId} | {complaint.department}
              </Typography>
            </Box>

            <StatusChip status={complaint.status} />
          </Stack>

          <Typography sx={{ mb: 2 }}>
            {complaint.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography>
            <b>Address:</b> {complaint.address}, {complaint.city},{" "}
            {complaint.state} - {complaint.pincode}
          </Typography>

          <Typography>
            <b>Urgency:</b> {complaint.urgency}
          </Typography>

          <Typography>
            <b>Customer:</b> {complaint.user?.name} (
            {complaint.user?.phone})
          </Typography>

          <Typography>
            <b>Assigned officer:</b>{" "}
            {complaint.assignedAgent?.name || "Not assigned"}
          </Typography>

          {pictureUrl && (
            <Box sx={{ mt: 3 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Attached Picture
              </Typography>

              <img
                src={pictureUrl}
                alt="Complaint attachment"
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  objectFit: "contain",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px"
                }}
              />
            </Box>
          )}

          {/* Only agents can update the status. */}
          {user?.role === "agent" && (
            <Box sx={{ mt: 3 }} className="form-grid">
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {[
                  "In Progress",
                  "Resolved",
                  "Closed",
                  "Rejected"
                ].map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={updateStatus}
              >
                Update Status
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
            Messages
          </Typography>

          <Box className="message-list">
            {messages.map((message) => (
              <Box
                key={message._id}
                className={`message ${
                  message.sender?._id === user?._id ? "mine" : ""
                }`}
              >
                <Typography variant="caption">
                  {message.sender?.name} - {message.sender?.role}
                </Typography>

                <Typography>{message.text}</Typography>
              </Box>
            ))}

            {!messages.length && (
              <Typography color="text.secondary">
                No messages yet.
              </Typography>
            )}
          </Box>

          <Box
            component="form"
            onSubmit={sendMessage}
            sx={{ display: "flex", gap: 1, mt: 2 }}
          >
            <TextField
              fullWidth
              size="small"
              label="Type message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}