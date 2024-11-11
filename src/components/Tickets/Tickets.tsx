// components
import {
  Box,
  Button,
  Grid2 as Grid,
  FormControl,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  CustomButton,
  alternativeButtonStyling,
  confirmButtonStyling,
  declineButtonStyling,
} from "../CustomButtons/CustomButton";
import CustomInput from "../CustomInput/CustomInput";
import DeleteIcon from "@mui/icons-material/Delete";
import { defaultConfirmationWindowValues } from "../ConfirmationWindow/ConfirmationWindow";

// types
import { TicketInputValues } from "../../contexts/types/types";

// hooks
import { useProjectsContext } from "../../contexts/projectsContext";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

// helper functions
import { isURL } from "../../helperFunctions/isUrl";
import { kyivTime } from "../../helperFunctions/timeFormat";

// libraries
import { v4 as uuidv4 } from "uuid";

// assets
import noTicketsImg from "../../assets/notickets.jpg";
import newTicket from "../../assets/newticket.jpg";

// variables
import { MAX_TICKET_LINKS } from "../../constants/constants";

export function Tickets() {
  // context
  const {
    projects,
    selectedProjectIndex,
    setSelectedTicketIndex,
    addTicket,
    removeTicket,
    setConfirmationWindowValues,
  } = useProjectsContext();

  // states
  const [newTicketInputIsOpen, setNewTicketInputIsOpen] =
    useState<boolean>(false);

  // forms setup
  const ticketForm = useForm<TicketInputValues>({
    defaultValues: {
      ticketName: "",
      ticketDescription: "",
      ticketLinks: [{ link: "", linkName: "", id: uuidv4() }],
    },
  });

  const { register, handleSubmit, reset, formState, control } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "ticketLinks",
    control,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setNewTicketInputIsOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset();
    setNewTicketInputIsOpen(false);
  }, [selectedProjectIndex]);

  // functions
  const submitTicket = (data: TicketInputValues) => {
    if (selectedProjectIndex !== null) {
      const newTicket = {
        ticketId: uuidv4(),
        createdAt: kyivTime(),
        ticketName: data.ticketName,
        ticketStatus: "active",
        ticketLinks: data.ticketLinks,
        ticketDescription: data.ticketDescription,
        ticketHistory: [],
      };

      addTicket(projects[selectedProjectIndex].projectId, newTicket);
    }
  };

  return (
    <Stack>
      {projects.length !== 0 ? (
        selectedProjectIndex !== null ? (
          <Box>
            <Typography sx={{ pb: 2 }}>
              Project{" "}
              <span
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffb84d",
                  borderRadius: "5px",
                }}
              >
                {projects[selectedProjectIndex].projectName}
              </span>
            </Typography>
            <form
              onSubmit={handleSubmit(submitTicket)}
              noValidate
              autoComplete="off"
              style={{ width: "100%" }}
            >
              {newTicketInputIsOpen ? (
                <Grid container>
                  <Grid
                    size={4}
                    sx={{
                      pl: 1,
                      pr: 1,
                      display: "flex",
                      flexWrap: "wrap",
                    }}
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
                        label="Name of the ticket *"
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
                        {newTicketInputIsOpen ? errors.ticketName?.message : ""}
                      </Typography>
                    </FormControl>
                    <FormControl
                      sx={{
                        width: "100%",
                        mt: 2,
                      }}
                    >
                      <CustomInput
                        multiline
                        rows={5}
                        label="Description of the issue"
                        {...register("ticketDescription")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    size={5}
                    sx={{
                      pl: 1,
                      pr: 1,
                    }}
                  >
                    <Box>
                      {fields.map((field, index) => (
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                          key={field.id}
                        >
                          <FormControl sx={{ flexGrow: 8 }}>
                            <CustomInput
                              label="Related link *"
                              {...register(
                                `ticketLinks.${index}.link` as const,
                                {
                                  pattern: {
                                    value: /^.{1,100}$/,
                                    message: "100 characters max",
                                  },
                                  validate: (fieldValue) =>
                                    isURL(fieldValue) ||
                                    "You must enter a link",
                                  required: true,
                                }
                              )}
                              error={
                                !!errors.ticketLinks &&
                                !!errors.ticketLinks[index]?.link
                              }
                            />
                            <Typography variant="subtitle2" color="error">
                              {newTicketInputIsOpen && errors.ticketLinks
                                ? errors.ticketLinks[index]?.link?.message
                                : null}
                            </Typography>
                          </FormControl>
                          <FormControl sx={{ flexGrow: 8 }}>
                            <CustomInput
                              variant="outlined"
                              label="Name of the service *"
                              {...register(
                                `ticketLinks.${index}.linkName` as const,
                                {
                                  pattern: {
                                    value: /^.{1,30}$/,
                                    message: "30 characters max",
                                  },
                                  required: true,
                                }
                              )}
                              error={
                                // this doesn't work, verify - 2 places
                                !!errors.ticketLinks &&
                                !!errors.ticketLinks[index]?.linkName
                              }
                            />
                            <Typography variant="subtitle2" color="error">
                              {newTicketInputIsOpen && errors.ticketLinks
                                ? errors.ticketLinks[index]?.linkName?.message
                                : ""}
                            </Typography>
                          </FormControl>
                          <DeleteIcon
                            sx={{
                              color: "secondary.main",
                              "&:hover": { color: "secondary.dark" },
                              cursor: "pointer",
                              visibility: index > 0 ? "visible" : "hidden",
                              flexGrow: 1,
                            }}
                            onClick={() => remove(index)}
                          />
                        </Stack>
                      ))}
                      <CustomButton
                        sx={{ mt: 2 }}
                        color="secondary"
                        onClick={() =>
                          fields.length < MAX_TICKET_LINKS &&
                          append({
                            link: "",
                            linkName: "",
                            id: uuidv4(),
                          })
                        }
                      >
                        Add new ticket link
                      </CustomButton>
                    </Box>
                  </Grid>
                  <Grid
                    size={3}
                    sx={{
                      pl: 1,
                      pr: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="column" sx={{ width: "100%" }}>
                      <CustomButton sx={confirmButtonStyling}>
                        Submit
                      </CustomButton>
                      <CustomButton
                        variant="contained"
                        sx={declineButtonStyling}
                        onClick={() => {
                          reset();
                          setNewTicketInputIsOpen(false);
                        }}
                      >
                        Cancel
                      </CustomButton>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <CustomButton
                  variant="contained"
                  onClick={() => setNewTicketInputIsOpen(true)}
                  sx={{ ...alternativeButtonStyling }}
                >
                  Create new ticket
                </CustomButton>
              )}
            </form>
          </Box>
        ) : (
          <Typography>Please select a project</Typography>
        )
      ) : (
        <Typography>Please create a project</Typography>
      )}

      <List>
        {selectedProjectIndex !== null ? (
          projects[selectedProjectIndex].tickets.length !== 0 ? (
            projects[selectedProjectIndex].tickets.map((ticket, i) => (
              <Box key={i}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedTicketIndex(i)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "info.main",
                        "&:hover": {
                          backgroundColor: "info.main",
                        },
                      },
                      borderRadius: ".3rem",
                      p: 0,
                    }}
                  >
                    <Link
                      to={`/projects/${projects[selectedProjectIndex].projectId}/tickets/${ticket.ticketId}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                        width: "100%",
                        height: "inherit",
                        textDecoration: "none",
                        padding: "5px 20px",
                      }}
                    >
                      <Typography
                        sx={{ flexGrow: 20, color: "secondary.dark" }}
                      >
                        {ticket.ticketName}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ flexGrow: 1.5, color: "secondary.dark" }}
                      >
                        Created on {ticket.createdAt}
                      </Typography>
                      <DeleteIcon
                        sx={{
                          color: "secondary.main",
                          "&:hover": { color: "secondary.dark" },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setConfirmationWindowValues({
                            isOpen: true,
                            message: `Are you sure you want to delete ticket ${projects[selectedProjectIndex].tickets[i].ticketName}?`,
                            onConfirm: () =>
                              removeTicket(
                                projects[selectedProjectIndex].projectId,
                                ticket.ticketId
                              ),
                            onDecline: () =>
                              setConfirmationWindowValues(
                                defaultConfirmationWindowValues
                              ),
                          });
                        }}
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
                {i ===
                projects[selectedProjectIndex].tickets.length - 1 ? null : (
                  <Divider
                    sx={{
                      backgroundColor: "secondary.dark",
                      opacity: ".2",
                      ml: 2,
                      mr: 2,
                    }}
                  />
                )}
              </Box>
            ))
          ) : (
            <Box
              component="img"
              sx={{
                borderRadius: "3px",
                height: "200px",
                width: "auto",
              }}
              alt="no projects yet"
              src={newTicketInputIsOpen ? newTicket : noTicketsImg}
            />
          )
        ) : null}
      </List>
    </Stack>
  );
}
