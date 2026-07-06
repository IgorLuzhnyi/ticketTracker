import {
  Box,
  Typography,
  List,
  Stack,
  Button,
  Link as MUILink,
  Divider,
  Tooltip,
} from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";
import DeleteIcon from "@mui/icons-material/Delete";

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
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row">
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
                    </Stack>
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
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ flex: 8, minWidth: 0 }}
                  >
                    <Tooltip title={linkData.linkName} placement="top">
                      <Typography
                        sx={{
                          flex: "1 1 150px",
                          minWidth: 100,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: "600",
                        }}
                      >
                        {linkData.linkName}:
                      </Typography>
                    </Tooltip>

                    <Tooltip title={linkData.link} placement="top">
                      <MUILink
                        href={linkData.link}
                        target="_blank"
                        sx={{
                          flex: "1 1 200px",
                          minWidth: 0,
                          px: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          color: "black",
                          textDecoration: "none",
                          fontFamily: theme.typography.fontFamily,
                          fontSize: "14px",
                        }}
                      >
                        {linkData.link}
                      </MUILink>
                    </Tooltip>
                  </Stack>
                  {linkData.id !== currentlyEditing && (
                    <Stack
                      direction="row"
                      sx={{ flex: 4, gap: 1, justifyContent: "end" }}
                    >
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
                      <DeleteIcon
                        sx={{
                          color: "secondary.main",
                          "&:hover": { color: "secondary.dark" },
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setEditingAction(ticketActions.removingLink);
                          setCurrentlyEditing(linkData.id);
                          setConfirmationWindowIsOpen(true);
                        }}
                      />
                    </Stack>
                  )}
                  <Stack>
                    {confirmationWindowIsOpen &&
                      linkData.id === currentlyEditing && (
                        <Stack
                          direction="row"
                          sx={{ flex: 4, alignItems: "center", gap: 1 }}
                        >
                          <Typography>Delete this link?</Typography>
                          <CustomButton
                            sx={{
                              ...confirmButtonStyling,
                            }}
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
                          </CustomButton>
                          <CustomButton
                            sx={declineButtonStyling}
                            onClick={() => {
                              resetEditingData();
                              setConfirmationWindowIsOpen(false);
                            }}
                          >
                            No
                          </CustomButton>
                        </Stack>
                      )}
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
              <Box key={field.id} sx={{ mb: 2, width: "fit-content" }}>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                  <CustomInput
                    variant="outlined"
                    label="Name of the service *"
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
                      !!errors.ticketLinks && !!errors.ticketLinks[index]?.link
                    }
                  />
                  <Typography variant="subtitle2" color="error">
                    {errors.ticketLinks
                      ? errors.ticketLinks[index]?.link?.message
                      : null}
                  </Typography>
                  <DeleteIcon
                    sx={{
                      color: "secondary.main",
                      "&:hover": { color: "secondary.dark" },
                      cursor: "pointer",
                    }}
                    onClick={() => remove(index)}
                  />
                </Stack>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </List>

          <CustomButton
            sx={alternativeButtonStyling}
            disabled={
              currentTicket?.ticketLinks.length &&
              currentTicket?.ticketLinks.length + fields.length ===
                MAX_TICKET_LINKS
                ? true
                : false
            }
            onClick={() => {
              // need to reset if was editing anything else before clicked this button
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
          </CustomButton>

          {fields.length > 0 && (
            <Box>
              <Button type="submit">Submit</Button>
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default TicketLinksSection;
