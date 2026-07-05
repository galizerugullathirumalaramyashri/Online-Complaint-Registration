import { Link } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import hero from "../assets/hero.png";

export default function Landing() {
  return (
    <Box className="landing-page">
      <Box className="landing-nav">
        <Typography variant="h6" fontWeight={800}>ComplaintCare</Typography>
        <Stack direction="row" gap={1}>
          <Button component={Link} to="/register" color="inherit">Register</Button>
          <Button component={Link} to="/login" color="inherit">Login</Button>
        </Stack>
      </Box>
      <Container maxWidth="lg" className="landing-hero">
        <Box className="landing-copy">
          <Typography variant="h2" fontWeight={400}>Empower Your Team,</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ my: 2 }}>
            Exceed Customer Expectations: Discover our Complaint Management Solution
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <Button component={Link} to="/login" variant="contained" size="large" startIcon={<LoginIcon />}>Login</Button>
            <Button component={Link} to="/register" variant="outlined" size="large" startIcon={<PersonAddAltIcon />}>SignUp</Button>
          </Stack>
        </Box>
        <Box component="img" src={hero} alt="Complaint support team" className="landing-image" />
      </Container>
    </Box>
  );
}