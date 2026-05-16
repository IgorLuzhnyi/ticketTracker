import {
  Box,
  Typography,
  List,
  Stack,
  FormControl,
  Button,
  Link as MUILink,
  Divider,
} from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";

import { useState } from "react";

import { MAX_TICKET_LINKS, ticketActions } from "../../constants/constants";

import { theme } from "../../theme";

import { isURL } from "../../helperFunctions/isUrl";

import { v4 as uuidv4 } from "uuid";

import { Ticket, TicketInputValues } from "../../contexts/types/types";

import { useProjectsContext } from "../../contexts/projectsContext";

import { UseFormReturn, useFieldArray } from "react-hook-form";

import {
  TicketLinksEditingAction,
  TicketLinksCurrentlyEditing,
} from "./types/types";
import {
  alternativeButtonStyling,
  confirmButtonStyling,
  CustomButton,
  declineButtonStyling,
} from "../CustomButtons/CustomButton";

type TicketLinksSectionProps = {
  ticket?: Ticket;
  projectId?: string;
  ticketId?: string;
  form: UseFormReturn<TicketInputValues>;
  editingAction: TicketLinksEditingAction;
  currentlyEditing: TicketLinksCurrentlyEditing;
  updateTicketWithMutableData: (data: TicketInputValues) => void;
  setEditingAction: (data: TicketLinksEditingAction) => void;
  setCurrentlyEditing: (data: TicketLinksCurrentlyEditing) => void;
  resetEditingData: () => void;
};

const TicketLinksSection = ({
  ticket: currentTicket,
  projectId,
  ticketId,
  form,
  currentlyEditing,
  editingAction,
  updateTicketWithMutableData,
  setEditingAction,
  setCurrentlyEditing,
  resetEditingData,
}: TicketLinksSectionProps) => {
  const [confirmationWindowIsOpen, setConfirmationWindowIsOpen] =
    useState<boolean>(false);

  const { control, register, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  const { updateTicket } = useProjectsContext();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ticketLinks",
  });

  return (
    <Box sx={{ mt: 1, pl: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Related links:
      </Typography>
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
                  <Stack
                    direction="row"
                    sx={{
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    <FormControl>
                      <CustomInput
                        autoFocus
                        variant="outlined"
                        sx={{ mr: 2 }}
                        defaultValue={
                          currentTicket?.ticketLinks[index].linkName
                        }
                        label="Name of the service *"
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
                      <Typography variant="subtitle2" color="error">
                        {currentlyEditing && errors.ticketLinks
                          ? errors.ticketLinks[index]?.linkName?.message
                          : ""}
                      </Typography>
                    </FormControl>
                    <FormControl>
                      <CustomInput
                        sx={{ mr: 2 }}
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
                    <Stack direction="row" sx={{ gap: 1 }}>
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
                          setCurrentlyEditing(null);
                        }}
                      >
                        Cancel
                      </CustomButton>
                    </Stack>
                  </Stack>
                  <Divider sx={{ mt: 1, mb: 1 }} />
                </form>
              </Stack>
            );
          } else {
            return (
              <Box key={index}>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Typography sx={{ flex: 2 }}>
                    {linkData.linkName}:&nbsp;
                  </Typography>
                  <MUILink
                    sx={{
                      flex: 8,
                      cursor: "pointer",
                      color: "black",
                      textDecoration: "none",
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.h5.fontSize,
                    }}
                  >
                    {linkData.link}
                  </MUILink>
                  <Stack direction="row" sx={{ flex: 2, gap: 1 }}>
                    <CustomButton
                      sx={alternativeButtonStyling}
                      onClick={() => {
                        replace([]);
                        setEditingAction(ticketActions.editingLink);
                        setCurrentlyEditing(linkData.id);
                      }}
                    >
                      Edit
                    </CustomButton>
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
                  </Stack>
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
                                {},
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
                <Divider sx={{ mt: 1, mb: 1 }} />
              </Box>
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
                      {...register(`ticketLinks.${index}.linkName` as const, {
                        pattern: {
                          value: /^.{1,30}$/,
                          message: "30 characters max",
                        },
                        // validate: (fieldValue) =>
                        //   !fieldValue && "Cannot be empty",
                        required: true,
                      })}
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
          currentTicket?.ticketLinks.length + fields.length === MAX_TICKET_LINKS
            ? `Max links number is ${MAX_TICKET_LINKS}`
            : "Add new ticket link"}
        </Button>
      </Box>
    </Box>
  );
};

export default TicketLinksSection;
