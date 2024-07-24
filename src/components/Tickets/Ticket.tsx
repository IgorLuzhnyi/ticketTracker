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
  const [currentlyEditing, setCurrentlyEditing] = useState<null | string>(null);

  // form setup
  const ticketForm = useForm<TicketInputValues>({});

  const { register, handleSubmit, reset, formState, control } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  // const { fields, append, remove } = useFieldArray({
  //   name: "ticketLinks",
  //   control,
  // });

  const updateTicketData = (data: TicketInputValues) => {
    const [editableAttribute, updatedValue] = Object.entries(data)[0];

    if (projectId && ticketId)
      updateTicket(projectId, ticketId, editableAttribute, updatedValue);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setCurrentlyEditing(null);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset();
  }, [selectedProjectIndex, currentlyEditing]);

  return (
    <Box>
      <Link to={`/projects/${projectId}/tickets`}>Back to main</Link>
      <Typography sx={{ p: 2 }}>
        Project {currentProject?.projectName}
      </Typography>
      <Stack direction="row">
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "400px",
            }}
          >
            {currentlyEditing === TICKET_ATTRIBUTES.ticketName ? (
              <form
                onSubmit={handleSubmit(updateTicketData)}
                noValidate
                autoComplete="off"
                style={{ width: "100%" }}
              >
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
                      {currentlyEditing === TICKET_ATTRIBUTES.ticketName
                        ? errors.ticketName?.message
                        : ""}
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
                        setCurrentlyEditing(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              </form>
            ) : (
              <Stack direction="row">
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
                  onClick={() => {
                    setCurrentlyEditing(TICKET_ATTRIBUTES.ticketName);
                  }}
                >
                  Edit
                </Button>
              </Stack>
            )}
          </Box>
          <Typography sx={{ p: 2 }}>
            Created at {currentTicket?.createdAt}
          </Typography>
          <Box>
            {currentlyEditing === TICKET_ATTRIBUTES.ticketDescription ? (
              <form
                onSubmit={handleSubmit(updateTicketData)}
                noValidate
                autoComplete="off"
                style={{ width: "100%" }}
              >
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
                      label="Ticket description"
                      defaultValue={currentTicket?.ticketDescription}
                      sx={{
                        backgroundColor: "primary.light",
                      }}
                      {...register("ticketDescription")}
                    />
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
                        setCurrentlyEditing(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              </form>
            ) : (
              <Stack direction="row">
                <Typography sx={{ p: 2 }}>
                  Description: {currentTicket?.ticketDescription}
                </Typography>
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "secondary.light",
                  }}
                  onClick={() => {
                    setCurrentlyEditing(TICKET_ATTRIBUTES.ticketDescription);
                  }}
                >
                  Edit
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
        <Box></Box>
      </Stack>
      <Typography sx={{ p: 2 }}>
        History {currentTicket?.ticketHistory.map((post) => post.message)}
      </Typography>
    </Box>
  );
}
