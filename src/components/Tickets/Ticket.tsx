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

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
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
import {
  alternativeButtonStyling,
  confirmButtonStyling,
  CustomButton,
  declineButtonStyling,
} from "../CustomButtons/CustomButton";

export function Ticket() {
  // variables
  const { projectId, ticketId } = useParams<{
    ticketId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const { projects, selectedProjectIndex, updateTicket } = useProjectsContext();

  const currentProject = projects.find(
    (project) => project.projectId === projectId,
  );
  const currentTicket = currentProject?.tickets.find(
    (ticket) => ticket.ticketId === ticketId,
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

    if (projectId && ticketId)
      updateTicket(
        editingAction,
        projectId,
        ticketId,
        currentTicketLinkId,
        data,
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

  return (
    <Box>
      <Link
        to={`/projects/${projectId}/tickets`}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          color: "#4f4f50",
        }}
      >
        <KeyboardBackspaceIcon />
        &nbsp;
        <Typography>Back to all tickets</Typography>
      </Link>
      <Typography variant="h4" sx={{ my: 2, fontWeight: "bold" }}>
        Project{" "}
        <span
          style={{
            padding: "5px 10px",
            backgroundColor: "#ffb84d",
            borderRadius: "5px",
          }}
        >
          {currentProject?.projectName}
        </span>
      </Typography>
      <Divider sx={{ my: 1, borderWidth: 0.5 }} />
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-around" }}
      >
        <Box sx={{ flex: 4, pr: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
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
                  <Stack direction="row" sx={{ width: "100%", gap: 1 }}>
                    <CustomButton
                      type="submit"
                      variant="contained"
                      sx={{ ...confirmButtonStyling, width: "100%" }}
                    >
                      Submit
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      sx={{ ...declineButtonStyling, width: "100%" }}
                      onClick={() => {
                        reset();
                        resetEditingData();
                      }}
                    >
                      Cancel
                    </CustomButton>
                  </Stack>
                </Box>
              </form>
            ) : (
              <Stack
                direction="row"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography>
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Ticket Name:
                  </Typography>{" "}
                  {currentTicket?.ticketName}
                </Typography>
                <CustomButton
                  sx={{ ...alternativeButtonStyling, py: 0 }}
                  onClick={() => {
                    setEditingAction(ticketActions.editingTicketName);
                    setCurrentlyEditing(TICKET_ATTRIBUTES.ticketName);
                  }}
                >
                  Edit
                </CustomButton>
              </Stack>
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6">
            Created at {currentTicket?.createdAt}
          </Typography>
          <Divider sx={{ my: 1 }} />
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
                    {...register("ticketDescription")}
                  />
                </FormControl>
                <Stack direction="row" sx={{ width: "100%", gap: 1 }}>
                  <CustomButton
                    type="submit"
                    variant="contained"
                    sx={{
                      ...confirmButtonStyling,
                      width: "100%",
                    }}
                  >
                    Submit
                  </CustomButton>
                  <CustomButton
                    variant="contained"
                    sx={{
                      ...declineButtonStyling,
                      width: "100%",
                    }}
                    onClick={() => {
                      reset();
                      resetEditingData();
                    }}
                  >
                    Cancel
                  </CustomButton>
                </Stack>
              </form>
            ) : (
              <Box>
                <Stack
                  direction="row"
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    Description:
                  </Typography>
                  <CustomButton
                    sx={{ ...alternativeButtonStyling, py: 0, flexShrink: 0 }}
                    onClick={() => {
                      setEditingAction(ticketActions.editingTicketDescription);
                      setCurrentlyEditing(TICKET_ATTRIBUTES.ticketDescription);
                    }}
                  >
                    Edit
                  </CustomButton>
                </Stack>
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {currentTicket?.ticketDescription}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flex: 8 }}>
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
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Box>
        <Typography sx={{ fontWeight: "bold" }}>History</Typography>
        <Box>{currentTicket?.ticketHistory.map((post) => post.message)}</Box>
      </Box>
    </Box>
  );
}
