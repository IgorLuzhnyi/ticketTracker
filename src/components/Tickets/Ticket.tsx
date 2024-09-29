// components
import {
  Box,
  Button,
  FormControl,
  Typography,
  Stack,
  List,
  Link as MUILink,
} from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";
import { Link } from "react-router-dom";

// types
import { TicketInputValues } from "../../contexts/types/types";

// hooks
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useForm, useFieldArray } from "react-hook-form";

// variables
import {
  TICKET_ATTRIBUTES,
  MAX_TICKET_LINKS,
  ticketActions,
} from "../../constants/constants";

// helper functions
import { isURL } from "../../helperFunctions/isUrl";

// libraries
import { v4 as uuidv4 } from "uuid";

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
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null);
  const [confirmationWindowIsOpen, setConfirmationWindowIsOpen] =
    useState<boolean>(false);

  const resetEditingData = () => {
    setEditingAction(null);
    setCurrentlyEditing(null);
  };

  // form setup
  const ticketForm = useForm<TicketInputValues>({});

  const { register, handleSubmit, reset, formState, control } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  const { fields, append, remove, replace } = useFieldArray({
    name: "ticketLinks",
    control,
  });

  const updateTicketWithMutableData = (data: TicketInputValues) => {
    const currentTicketLinkId = data.ticketLinks ? currentlyEditing : null;

    // console.log(data);

    if (projectId && ticketId)
      updateTicket(
        editingAction,
        projectId,
        ticketId,
        currentTicketLinkId,
        data
      );
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log("form was submitted successfully");
      reset();
      resetEditingData();
      if (fields.length > 0) fields.length = 0;
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset();
  }, [selectedProjectIndex, currentlyEditing]);

  useEffect(() => {
    editingAction !== ticketActions.addingLink ||
      editingAction !== ticketActions.editingLink;
    fields.length = 0;
  }, [editingAction]);

  // console.log(currentTicket);

  return (
    <Box>
      <Link to={`/projects/${projectId}/tickets`}>Back to main</Link>
      <Typography sx={{ p: 2 }}>
        Project {currentProject?.projectName}
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
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

        {/* SECTION WITH LINKS */}
        <Box sx={{ backgroundColor: "#89e8a2" }}>
          <List>
            {currentTicket?.ticketLinks.map((linkData, index) => {
              if (
                currentlyEditing === linkData.id &&
                editingAction === ticketActions.editingLink
              ) {
                return (
                  <Stack direction="row" key={index}>
                    <form
                      onSubmit={handleSubmit(updateTicketWithMutableData)}
                      noValidate
                      autoComplete="off"
                      style={{ width: "100%" }}
                    >
                      <Stack direction="row">
                        <FormControl>
                          <CustomInput
                            variant="outlined"
                            defaultValue={
                              currentTicket?.ticketLinks[index].linkName
                            }
                            label="Name of the service *"
                            sx={{
                              backgroundColor: "primary.light",
                            }}
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
                              !!errors.ticketLinks &&
                              !!errors.ticketLinks[index]?.linkName
                            }
                          />
                          <Typography variant="subtitle2" color="error">
                            {currentlyEditing && errors.ticketLinks
                              ? errors.ticketLinks[index]?.linkName?.message
                              : ""}
                          </Typography>
                        </FormControl>
                        <FormControl>
                          <CustomInput
                            defaultValue={
                              currentTicket?.ticketLinks[index].link
                            }
                            label="Related link *"
                            {...register(`ticketLinks.${index}.link` as const, {
                              pattern: {
                                value: /^.{1,100}$/,
                                message: "100 characters max",
                              },
                              validate: (fieldValue) =>
                                isURL(fieldValue) || "You must enter a link",
                              required: true,
                            })}
                            error={
                              !!errors.ticketLinks &&
                              !!errors.ticketLinks[index]?.link
                            }
                          />
                          <Typography variant="subtitle2" color="error">
                            {currentlyEditing && errors.ticketLinks
                              ? errors.ticketLinks[index]?.link?.message
                              : null}
                          </Typography>
                        </FormControl>
                        <Stack direction="row" sx={{ width: "100%" }}>
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{
                              color: "secondary.main",
                              backgroundColor: "info.main",
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
                              mb: 2,
                            }}
                            onClick={() => {
                              reset();
                              setCurrentlyEditing(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    </form>
                  </Stack>
                );
              } else {
                return (
                  <Stack direction="row" key={index}>
                    <Typography>
                      {linkData.linkName}: {/* space isn't added */}
                    </Typography>
                    <MUILink sx={{ cursor: "pointer", color: "black" }}>
                      {linkData.link}
                    </MUILink>
                    <Button
                      sx={{ color: "black" }}
                      onClick={() => {
                        replace([]);
                        setEditingAction(ticketActions.editingLink);
                        setCurrentlyEditing(linkData.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ color: "black" }}
                      onClick={() => {
                        setEditingAction(ticketActions.removingLink);
                        setCurrentlyEditing(linkData.id);
                        setConfirmationWindowIsOpen(true);
                      }}
                    >
                      Remove
                    </Button>
                    {/* confirmation window */}
                    <Stack>
                      {confirmationWindowIsOpen &&
                      linkData.id === currentlyEditing ? (
                        <Stack>
                          <Typography>
                            Are you sure you want to delete this link?
                          </Typography>
                          <Button
                            onClick={() => {
                              if (projectId && ticketId)
                                updateTicket(
                                  editingAction,
                                  projectId,
                                  ticketId,
                                  currentlyEditing,
                                  {}
                                );
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => {
                              resetEditingData();
                              setConfirmationWindowIsOpen(false);
                            }}
                          >
                            No
                          </Button>
                        </Stack>
                      ) : null}
                    </Stack>
                  </Stack>
                );
              }
            })}
          </List>

          {/* section with NEW links */}
          <Box>
            <form
              onSubmit={handleSubmit(updateTicketWithMutableData)}
              noValidate
              autoComplete="off"
              style={{ width: "100%" }}
            >
              <List>
                {fields.map((field, index) => (
                  <Stack direction="row" key={field.id}>
                    <Stack direction="row">
                      <FormControl>
                        <CustomInput
                          variant="outlined"
                          label="Name of the service *"
                          sx={{
                            backgroundColor: "primary.light",
                          }}
                          {...register(
                            `ticketLinks.${index}.linkName` as const,
                            {
                              pattern: {
                                value: /^.{1,30}$/,
                                message: "30 characters max",
                              },
                              // validate: (fieldValue) =>
                              //   !fieldValue && "Cannot be empty",
                              required: true,
                            }
                          )}
                          error={
                            !!errors.ticketLinks &&
                            !!errors.ticketLinks[index]?.linkName
                          }
                        />
                        <Typography variant="subtitle2" color="error">
                          {errors.ticketLinks
                            ? errors.ticketLinks[index]?.linkName?.message
                            : null}
                        </Typography>
                      </FormControl>
                      <FormControl>
                        <CustomInput
                          label="Related link *"
                          {...register(`ticketLinks.${index}.link` as const, {
                            pattern: {
                              value: /^.{1,200}$/,
                              message: "200 characters max",
                            },
                            validate: (fieldValue) =>
                              isURL(fieldValue) || "You must enter a link",
                            required: true,
                          })}
                          error={
                            !!errors.ticketLinks &&
                            !!errors.ticketLinks[index]?.link
                          }
                        />
                        <Typography variant="subtitle2" color="error">
                          {errors.ticketLinks
                            ? errors.ticketLinks[index]?.link?.message
                            : null}
                        </Typography>
                      </FormControl>
                      <Button color="secondary" onClick={() => remove(index)}>
                        X
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </List>
              {fields.length > 0 && (
                <Stack direction="row">
                  <Button type="submit">Submit</Button>
                </Stack>
              )}
            </form>
            <Button
              color="secondary"
              disabled={
                currentTicket?.ticketLinks.length &&
                currentTicket?.ticketLinks.length + fields.length ===
                  MAX_TICKET_LINKS
                  ? true
                  : false
              }
              onClick={() => {
                if (editingAction !== ticketActions.editingLink) {
                  setEditingAction(ticketActions.addingLink);
                } else {
                  setEditingAction(ticketActions.addingLink);
                  reset({ ticketLinks: [] }); // this line causes issue. probably refine updateWithMutable
                }
                append({
                  link: "",
                  linkName: "",
                  id: uuidv4(),
                });
              }}
            >
              {currentTicket?.ticketLinks.length &&
              currentTicket?.ticketLinks.length + fields.length ===
                MAX_TICKET_LINKS
                ? `Max links number is ${MAX_TICKET_LINKS}`
                : "Add new ticket link"}
            </Button>
          </Box>
        </Box>
      </Stack>
      <Typography sx={{ p: 2 }}>
        History {currentTicket?.ticketHistory.map((post) => post.message)}
      </Typography>
    </Box>
  );
}
