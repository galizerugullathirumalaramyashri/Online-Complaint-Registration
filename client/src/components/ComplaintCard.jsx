import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "./StatusChip";

export default function ComplaintCard({ complaint }) {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" className="complaint-card">
      <CardActionArea onClick={() => navigate(`/complaints/${complaint._id}`)}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Typography variant="h6">{complaint.category}</Typography>
            <StatusChip status={complaint.status} />
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>{complaint.complaintId} | {complaint.department}</Typography>
          <Typography sx={{ mt: 1 }}>{complaint.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{complaint.city}, {complaint.state}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Assigned agent: {complaint.assignedAgent?.name || "Not assigned"}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}