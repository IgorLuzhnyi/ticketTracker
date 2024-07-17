// components
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// hooks
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";

export function Ticket() {
  const params = useParams<{ ticketId: string; projectId: string }>();
  const { projects } = useProjectsContext();
  const currentProject = projects.find(
    (project) => project.projectId === params.projectId
  );
  const currentTicket = currentProject?.tickets.find(
    (ticket) => ticket.ticketId === params.ticketId
  );

  // console.log(currentTicket);

  // states
  const [isEditingTiket, setIsEditingTicket] = useState(false);

  return (
    <Box>
      <Link to={`/projects/${params.projectId}/tickets`}>Back to main</Link>
      <Typography sx={{ p: 2 }}>
        Project {currentProject?.projectName}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "400px",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Ticket Name
          </Typography>{" "}
          {currentTicket?.ticketName}
        </Typography>
        <Button
          sx={{
            color: "black",
            backgroundColor: "secondary.light",
          }}
          onClick={() => {}}
        >
          Edit
        </Button>
      </Box>
      <Typography sx={{ p: 2 }}>
        Created at {currentTicket?.createdAt}
      </Typography>
      <Typography sx={{ p: 2 }}>
        Description {currentTicket?.description}
      </Typography>
      <Typography sx={{ p: 2 }}>
        History {currentTicket?.ticketHistory.map((post) => post.message)}
      </Typography>
    </Box>
  );
}
