import {
  Box,
  Button,
  Grid,
  FormControl,
  TextField,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { isURL } from "../../helperFunctions/isUrl";

type TicketHistory = {
  noteDate: Date;
  message: string;
  author: string;
};

type TicketInputValues = {
  ticketName: string;
  ticketDate: Date;
  link: string;
  description: string;
  ticketHistory: TicketHistory[];
};

export function Tickets() {
  // context
  const {
    projects,
    selectedProjectIndex,
    selectedTicketIndex,
    setSelectedTicketIndex,
    addTicket,
  } = useProjectsContext();

  // variables
  const [newTicketInputIsOpen, setNewTicketInputIsOpen] =
    useState<boolean>(false);

  // const today = new Date();
  // console.log(today.toLocaleDateString() + " " + today.toLocaleTimeString());

  // form setup
  const ticketForm = useForm<TicketInputValues>({
    defaultValues: {
      ticketName: "",
      link: "",
      description: "",
      ticketHistory: [],
    },
  });
  const { register, handleSubmit, reset, formState } = ticketForm;
  const { isSubmitSuccessful, errors } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setNewTicketInputIsOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  // functions
  const submitTicket = (data: TicketInputValues) => {
    if (selectedProjectIndex !== null)
      addTicket(projects[selectedProjectIndex].id, {
        id: uuidv4(),
        ticketName: data.ticketName,
        link: data.link,
        description: data.description,
        history: [], // change that, mind the existing data?
      });
  };

  return (
    <Stack>
      <Box>
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
                  <TextField
                    autoFocus
                    variant="outlined"
                    id="new-project"
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
                        value: /^(?=(.*[A-Za-z]){3})[A-Za-z\d]{1,50}$/,
                        message:
                          "Must contain at least 3 letters, 50 characters max",
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
                    alignSelf: "flex-end",
                  }}
                >
                  <TextField
                    variant="outlined"
                    id="new-project"
                    label="Link to the ticket *"
                    sx={{
                      backgroundColor: "primary.light",
                    }}
                    {...register("link", {
                      required: {
                        value: true,
                        message: "Link to the ticket is required",
                      },
                      validate: (fieldValue) => {
                        return isURL(fieldValue) || "You must enter a link";
                      },
                    })}
                    error={!!errors.link}
                  />
                  <Typography variant="subtitle2" color="error">
                    {newTicketInputIsOpen ? errors.link?.message : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={6}
                sx={{
                  pl: 1,
                  pr: 1,
                }}
              >
                <FormControl
                  sx={{
                    width: "100%",
                  }}
                >
                  <TextField
                    multiline
                    rows={5}
                    id="new-project"
                    label="Description of the issue"
                    sx={{
                      backgroundColor: "primary.light",
                    }}
                    {...register("description")}
                  />
                </FormControl>
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
                    onClick={() => setNewTicketInputIsOpen(false)}
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
      <List>
        {selectedProjectIndex !== null ? (
          projects[selectedProjectIndex].tickets.map((ticket, i) => (
            <Box key={i}>
              <ListItem>
                <ListItemButton>{ticket.ticketName}</ListItemButton>
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
          <Typography>Please select a project</Typography>
        )}
      </List>
    </Stack>
  );
}
