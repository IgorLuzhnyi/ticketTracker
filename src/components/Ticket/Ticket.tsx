// components
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// hooks
import { useParams } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";

export function Ticket() {
  const params = useParams<{ ticketId: string; projectId: string }>();
  const { projects } = useProjectsContext();
  const currentTicket = projects
    .find((project) => project.projectId === params.projectId)
    ?.tickets.find((ticket) => ticket.ticketId === params.ticketId);

  // console.log(currentTicket);

  return (
    <Box>
      <Link to={`/projects/${params.projectId}/tickets`}>Back to main</Link>
      <Typography>Ticket Name {currentTicket?.ticketName}</Typography>
      <Typography>Created at {currentTicket?.createdAt}</Typography>
      <Typography>Description {currentTicket?.description}</Typography>
      <Typography>
        History {currentTicket?.ticketHistory.map((post) => post.message)}
      </Typography>
    </Box>
  );
}
