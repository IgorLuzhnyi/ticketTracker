// components
import {
  Box,
  Button,
  FormControl,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";
import { Link } from "react-router-dom";

import TicketLinksSection from "./TicketLinksSection";

// types
import { TicketInputValues } from "../../contexts/types/types";
import {
  TicketLinksEditingAction,
  TicketLinksCurrentlyEditing,
} from "./types/types";

// hooks
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useForm } from "react-hook-form";

// variables
import { TICKET_ATTRIBUTES, ticketActions } from "../../constants/constants";

export function Ticket() {
  // variables
  const { projectId, ticketId } = useParams<{
    ticketId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const { projects, selectedProjectIndex, updateTicket } = useProjectsContext();

  const currentProject = projects.find(
    (project) => project.projectId === projectId
  );
  const currentTicket = currentProject?.tickets.find(
    (ticket) => ticket.ticketId === ticketId
  );

  // states
  const [editingAction, setEditingAction] =
    useState<TicketLinksEditingAction>(null);
  const [currentlyEditing, setCurrentlyEditing] =
    useState<TicketLinksCurrentlyEditing>(null);

  const resetEditingData = () => {
    setEditingAction(null);
    setCurrentlyEditing(null);
  };

  // form setup
  const ticketForm = useForm<TicketInputValues>({});

  const { register, handleSubmit, reset, formState } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  const updateTicketWithMutableData = (data: TicketInputValues) => {
    const currentTicketLinkId = data.ticketLinks ? currentlyEditing : null;

    console.log(data);

    if (projectId && ticketId)
      updateTicket(
        editingAction,
        projectId,
        ticketId,
        currentTicketLinkId,
        data
      );
  };

  // check if the ticket ID path is valid
  useEffect(() => {
    const allTicketIds = projects
      .map((project) => project.tickets.map((ticket) => ticket.ticketId))
      .flat();
    if (ticketId) {
      !allTicketIds.includes(ticketId) &&
        navigate(`projects/${projectId}/tickets`);
    }
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log("form was submitted successfully");
      reset();
      resetEditingData();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset();
  }, [selectedProjectIndex, currentlyEditing]);

  // console.log(currentTicket);

  return (
    <Box>
      <Link to={`/projects/${projectId}/tickets`}>Back to main</Link>
      <Typography sx={{ p: 2 }}>
        Project {currentProject?.projectName}
      </Typography>
      <Stack direction="row">
        <Box sx={{ mr: 4, minWidth: "400px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "400px",
            }}
          >
            {currentlyEditing === TICKET_ATTRIBUTES.ticketName ? (
              <form
                onSubmit={handleSubmit(updateTicketWithMutableData)}
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
                        resetEditingData();
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
                    Ticket Name:
                  </Typography>{" "}
                  {currentTicket?.ticketName}
                </Typography>
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "secondary.light",
                  }}
                  onClick={() => {
                    setEditingAction(ticketActions.editingTicketName);
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
                onSubmit={handleSubmit(updateTicketWithMutableData)}
                noValidate
                autoComplete="off"
                style={{ width: "100%" }}
              >
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
                      resetEditingData();
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
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
                    setEditingAction(ticketActions.editingTicketDescription);
                    setCurrentlyEditing(TICKET_ATTRIBUTES.ticketDescription);
                  }}
                >
                  Edit
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        <TicketLinksSection
          ticket={currentTicket}
          projectId={projectId}
          ticketId={ticketId}
          form={ticketForm}
          editingAction={editingAction}
          currentlyEditing={currentlyEditing}
          updateTicketWithMutableData={updateTicketWithMutableData}
          setEditingAction={setEditingAction}
          setCurrentlyEditing={setCurrentlyEditing}
          resetEditingData={resetEditingData}
        />
      </Stack>
      <Typography sx={{ p: 2 }}>
        History {currentTicket?.ticketHistory.map((post) => post.message)}
      </Typography>
    </Box>
  );
}
