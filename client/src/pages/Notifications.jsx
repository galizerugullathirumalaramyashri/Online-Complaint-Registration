import { useEffect, useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const load = () => api.get("/notifications").then((r) => setItems(r.data)).catch((e) => setError(e.response?.data?.message || "Could not load notifications"));
  useEffect(() => { load(); }, []);
  const readAll = async () => { await api.put("/notifications/read-all"); load(); };
  const markRead = async (id) => { await api.put(`/notifications/${id}/read`); load(); };
  return <Box><Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}><Typography variant="h4" fontWeight={800}>Notifications</Typography><Button onClick={readAll}>Mark all as read</Button></Stack>{error && <Alert severity="error">{error}</Alert>}<Stack spacing={2} sx={{ mt: 2 }}>{items.map((item) => <Paper key={item._id} sx={{ p: 2, borderLeft: item.isRead ? "4px solid #ddd" : "4px solid #0f766e" }}><Typography fontWeight={700}>{item.title}</Typography><Typography sx={{ my: 1 }}>{item.message}</Typography>{item.complaint && <Button component={Link} to={`/complaints/${item.complaint._id}`}>Open complaint</Button>}{!item.isRead && <Button onClick={() => markRead(item._id)}>Mark read</Button>}</Paper>)}{!items.length && <Paper sx={{ p: 3 }}><Typography>No notifications yet.</Typography></Paper>}</Stack></Box>;
}
