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
import { TicketInputValues } from "../../contexts/projectsContext";

// hooks
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useForm, useFieldArray } from "react-hook-form";

// variables
import {
  TICKET_ATTRIBUTES,
  MAX_ADDITIONAL_TICKET_LINKS,
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
  const [currentlyEditing, setCurrentlyEditing] = useState<null | string>(null);

  // form setup
  const ticketForm = useForm<TicketInputValues>({});

  const { register, handleSubmit, reset, formState, control } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  const { fields, append, remove, replace } = useFieldArray({
    name: "ticketLinks",
    control,
  });

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
    console.log("form has been reset");
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

        {/* SECTION WITH LINKS */}
        <Box sx={{ backgroundColor: "#89e8a2" }}>
          <List>
            {currentTicket?.ticketLinks.map((linkData, index) => {
              if (currentlyEditing === linkData.linkName) {
                return (
                  <Stack direction="row" key={index}>
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
                        {...register(`ticketLinks.${index}.linkName` as const, {
                          pattern: {
                            value: /^.{1,30}$/,
                            message: "30 characters max",
                          },
                        })}
                        error={
                          // this doesn't work, verify - 2 places
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
                        defaultValue={currentTicket?.ticketLinks[index].link}
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

                    {/* <Button color="secondary" onClick={() => remove(index)}> // to refine
                      X
                    </Button> */}
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
                        setCurrentlyEditing(linkData.linkName);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ color: "black" }}
                      onClick={() => {
                        // write a function for removing the link
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                );
              }
            })}
          </List>

          <List>
            {fields.map((field, index) => {
              console.log(fields);
              // const trueIndex = currentTicket?.ticketLinks.length
              //   ? currentTicket?.ticketLinks.length + index
              //   : index;
              return (
                <Stack direction="row" key={field.id}>
                  <FormControl>
                    <CustomInput
                      variant="outlined"
                      label="Name of the service *"
                      sx={{
                        backgroundColor: "primary.light",
                      }}
                      {...register(`ticketLinks.${index}.linkName` as const, {
                        pattern: {
                          value: /^.{1,30}$/,
                          message: "30 characters max",
                        },
                        required: true,
                      })}
                      error={
                        !!errors.ticketLinks &&
                        !!errors.ticketLinks[index]?.linkName
                      }
                    />
                    {/* <Typography variant="subtitle2" color="error">
                      {currentlyEditing ===
                        currentTicket?.ticketLinks[index].linkName &&
                      errors.ticketLinks
                        ? errors.ticketLinks[index]?.linkName?.message
                        : ""}
                    </Typography> */}
                  </FormControl>
                  <FormControl>
                    <CustomInput
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
                      {errors.ticketLinks
                        ? errors.ticketLinks[index]?.link?.message
                        : null}
                    </Typography>
                  </FormControl>

                  <Button color="secondary" onClick={() => remove(index)}>
                    X
                  </Button>
                </Stack>
              );
            })}
          </List>

          <Button
            color="secondary"
            onClick={() => {
              if (
                currentTicket?.ticketLinks.length &&
                currentTicket?.ticketLinks.length + fields.length <
                  MAX_ADDITIONAL_TICKET_LINKS
              ) {
                setCurrentlyEditing(null);
                if (
                  currentTicket.ticketLinks.find(
                    (linkData) => linkData.linkName === currentlyEditing
                  )
                )
                  replace([]);
                append({ link: "", linkName: "", id: uuidv4() });
              } else {
                // show error message
              }
            }}
          >
            Add new ticket link
          </Button>
        </Box>
      </Stack>
      <Typography sx={{ p: 2 }}>
        History {currentTicket?.ticketHistory.map((post) => post.message)}
      </Typography>
    </Box>
  );
}
