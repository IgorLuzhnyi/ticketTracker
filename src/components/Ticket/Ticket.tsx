// components
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// hooks
import { useParams } from "react-router-dom";

export function Ticket() {
  const params = useParams<{ ticketId: string; projectId: string }>();

  return (
    <Box>
      <Typography>Ticket {params.ticketId}</Typography>
      <Link to={`/projects/${params.projectId}/tickets`}>Back to main</Link>
    </Box>
  );
}
