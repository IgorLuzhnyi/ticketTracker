// components
import { Box, Button, FormControl, Typography, Stack } from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";
import { Link } from "react-router-dom";
import { TICKET_ATTRIBUTES } from "../../constants/constants";

// types
import { TicketInputValues } from "../../contexts/projectsContext";

// hooks
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useForm, useFieldArray } from "react-hook-form";

export function Ticket() {
  // variables

  const { projectId, ticketId } = useParams<{
    ticketId: string;
    projectId: string;
  }>();
  const { projects, selectedProjectIndex, updateTicket } = useProjectsContext();

  const currentProject = projects.find(
    (project) => project.projectId === projectId
  );
  const currentTicket = currentProject?.tickets.find(
    (ticket) => ticket.ticketId === ticketId
  );

  // states
  const [isEditingTiketName, setIsEditingTicketName] = useState(false);

  // form setup
  const ticketForm = useForm<TicketInputValues>({});

  const { register, handleSubmit, reset, formState, control } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  // const { fields, append, remove } = useFieldArray({
  //   name: "links",
  //   control,
  // });

  const updateTicketName = (data: TicketInputValues) => {
    if (projectId && ticketId)
      updateTicket(
        projectId,
        ticketId,
        TICKET_ATTRIBUTES.ticketName,
        data.ticketName
      );
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsEditingTicketName(false);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset();
    setIsEditingTicketName(false);
  }, [selectedProjectIndex]);

  return (
    <Box>
      <Link to={`/projects/${projectId}/tickets`}>Back to main</Link>
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
        {isEditingTiketName ? (
          <form
            onSubmit={handleSubmit(updateTicketName)}
            noValidate
            autoComplete="off"
            style={{ width: "100%" }}
          >
            {isEditingTiketName ? (
              <Box>
                <FormControl
                  sx={{
                    width: "100%",
                    alignSelf: "flex-start",
                  }}
                >
                  <CustomInput
                    autoFocus
                    variant="outlined"
                    label="Name of the ticket *"
                    defaultValue={currentTicket?.ticketName}
                    sx={{
                      backgroundColor: "primary.light",
                    }}
                    {...register("ticketName", {
                      required: {
                        value: true,
                        message: "Ticket name is required",
                      },
                      pattern: {
                        value: /^.{1,50}$/,
                        message: "50 characters max",
                      },
                    })}
                    error={!!errors.ticketName}
                  />
                  <Typography variant="subtitle2" color="error">
                    {isEditingTiketName ? errors.ticketName?.message : ""}
                  </Typography>
                </FormControl>
                <Stack direction="row" sx={{ width: "100%" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "secondary.main",
                      backgroundColor: "info.main",
                      width: "100%",
                      mb: 2,
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      color: "secondary.main",
                      backgroundColor: "red",
                      width: "100%",
                      marginBottom: "auto",
                      alignSelf: "flex-end",
                    }}
                    onClick={() => {
                      reset();
                      setIsEditingTicketName(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={() => setIsEditingTicketName(true)}
                sx={{
                  color: "secondary.main",
                  backgroundColor: "info.main",
                }}
              >
                Create new ticket
              </Button>
            )}
          </form>
        ) : (
          // <div>to be edited</div>
          <Typography sx={{ p: 2 }}>
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              Ticket Name
            </Typography>{" "}
            {currentTicket?.ticketName}
          </Typography>
        )}
        {isEditingTiketName ? null : (
          <Button
            sx={{
              color: "black",
              backgroundColor: "secondary.light",
            }}
            onClick={() => setIsEditingTicketName(true)}
          >
            Edit
          </Button>
        )}
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
