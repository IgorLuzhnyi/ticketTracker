// components
import {
  Box,
  Button,
  Grid,
  FormControl,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import CustomInput from "../CustomInput/CustomInput";

// types
import { TicketInputValues } from "../../contexts/projectsContext";

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

// variables
import { MAX_ADDITIONAL_TICKET_LINKS } from "../../constants/constants";

export function Tickets() {
  // context
  const {
    projects,
    selectedProjectIndex,
    selectedTicketIndex,
    setSelectedTicketIndex,
    addTicket,
    removeTicket,
  } = useProjectsContext();

  // variables
  const [newTicketInputIsOpen, setNewTicketInputIsOpen] =
    useState<boolean>(false);

  // forms setup
  const ticketForm = useForm<TicketInputValues>({
    defaultValues: {
      ticketName: "",
      ticketDescription: "",
    },
  });

  const { register, handleSubmit, reset, formState, control } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "links",
    control,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
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
        links: data.links,
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
            <Typography>
              Project {projects[selectedProjectIndex].projectName}
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
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
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
                        sx={{
                          backgroundColor: "primary.light",
                        }}
                        {...register("ticketDescription")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xl={5}
                    lg={5}
                    md={5}
                    sm={5}
                    xs={5}
                    sx={{
                      pl: 1,
                      pr: 1,
                    }}
                  >
                    <Box>
                      {fields.map((field, index) => (
                        <Stack direction="row" key={field.id}>
                          <FormControl>
                            {/* <TextField
                              variant="outlined"
                              label="Related link"
                              sx={{
                                backgroundColor: "primary.light",
                              }}
                              {...register(`links.${index}.link` as const, {
                                pattern: {
                                  value: /^.{1,100}$/,
                                  message: "100 characters max",
                                },
                                validate: (fieldValue) =>
                                  isURL(fieldValue) || "You must enter a link",
                              })}
                              error={
                                !!errors.links && !!errors.links[index]?.link
                              }
                            /> */}
                            <CustomInput
                              label="Related link"
                              {...register(`links.${index}.link` as const, {
                                pattern: {
                                  value: /^.{1,100}$/,
                                  message: "100 characters max",
                                },
                                validate: (fieldValue) =>
                                  isURL(fieldValue) || "You must enter a link",
                              })}
                              error={
                                !!errors.links && !!errors.links[index]?.link
                              }
                            />
                            <Typography variant="subtitle2" color="error">
                              {newTicketInputIsOpen && errors.links
                                ? errors.links[index]?.link?.message
                                : ""}
                            </Typography>
                          </FormControl>
                          <FormControl>
                            <CustomInput
                              variant="outlined"
                              label="Name of the service"
                              sx={{
                                backgroundColor: "primary.light",
                              }}
                              {...register(`links.${index}.linkName` as const, {
                                pattern: {
                                  value: /^.{1,30}$/,
                                  message: "30 characters max",
                                },
                              })}
                              error={
                                // this doesn't work, verify
                                !!errors.links &&
                                !!errors.links[index]?.linkName
                              }
                            />
                            <Typography variant="subtitle2" color="error">
                              {newTicketInputIsOpen && errors.links
                                ? errors.links[index]?.linkName?.message
                                : ""}
                            </Typography>
                          </FormControl>
                          {index > 0 && (
                            <Button
                              color="secondary"
                              onClick={() => remove(index)}
                            >
                              X
                            </Button>
                          )}
                        </Stack>
                      ))}
                      <Button
                        color="secondary"
                        onClick={() =>
                          fields.length < MAX_ADDITIONAL_TICKET_LINKS &&
                          append({ link: "", linkName: "" })
                        }
                      >
                        Add new ticket link
                      </Button>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xl={2}
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}
                    sx={{
                      pl: 1,
                      pr: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="column" sx={{ width: "100%" }}>
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
                          setNewTicketInputIsOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setNewTicketInputIsOpen(true)}
                  sx={{
                    color: "secondary.main",
                    backgroundColor: "info.main",
                  }}
                >
                  Create new ticket
                </Button>
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
                    selected={selectedTicketIndex === i}
                    onClick={() => setSelectedTicketIndex(i)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "info.main",
                        "&:hover": {
                          backgroundColor: "info.main",
                        },
                      },
                      borderRadius: ".3rem",
                      justifyContent: "space-between",
                      p: 0,
                      position: "relative",
                    }}
                  >
                    <Link
                      to={`/projects/${projects[selectedProjectIndex].projectId}/tickets/${ticket.ticketId}`}
                      style={{
                        width: "100%",
                        height: "inherit",
                        padding: "5px",
                      }}
                    >
                      {ticket.ticketName}
                    </Link>
                    <Typography sx={{ position: "absolute", right: 0 }}>
                      Created on {ticket.createdAt}
                    </Typography>
                  </ListItemButton>
                  <Button
                    sx={{ color: "black" }}
                    onClick={() =>
                      removeTicket(
                        projects[selectedProjectIndex].projectId,
                        ticket.ticketId
                      )
                    }
                  >
                    X
                  </Button>
                </ListItem>
                {i ===
                projects[selectedProjectIndex].tickets.length - 1 ? null : (
                  <Divider
                    sx={{
                      backgroundColor: "secondary.light",
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
              }}
              alt="no projects yet"
              src={noTicketsImg}
            />
          )
        ) : (
          <Typography>No projects yet</Typography>
        )}
      </List>
    </Stack>
  );
}
