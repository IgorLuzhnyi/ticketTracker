// components
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";

// hooks
import { useParams } from "react-router-dom";

export function Ticket() {
  const params = useParams<{ ticketId: string; projectId: string }>();
  const { projects } = useProjectsContext();
  const currentTicket = projects
    .find((project) => project.projectId === params.projectId)
    ?.tickets.find((ticket) => ticket.ticketId === params.ticketId);

  // console.log(currentTicket);

  return (
    <Box>
      <Typography>Ticket {params.ticketId}</Typography>
      <Link to={`/projects/${params.projectId}/tickets`}>Back to main</Link>
    </Box>
  );
}
