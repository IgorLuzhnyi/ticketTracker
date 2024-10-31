import { memo } from "react";
import { useProjectsContext } from "../../contexts/projectsContext";
import { Box, Typography, Stack } from "@mui/material";
import {
  CustomButton,
  confirmButtonStyling,
  declineButtonStyling,
} from "../CustomButtons/CustomButton";

export const defaultConfirmationWindowValues = {
  isOpen: false,
  message: "",
  onConfirm: () => null,
  onDecline: () => null,
};

const ConfirmationWindow = ({ ...props }) => {
  const { isOpen, message, onConfirm, onDecline } = props.values;
  const { setConfirmationWindowValues } = useProjectsContext();
  return (
    <Box
      sx={{
        display: isOpen ? "block" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(10, 25, 47, 0.5)", // change later
        zIndex: 9999999,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minHeight: "150px",
          width: "300px",
          backgroundColor: "secondary.dark",
          borderRadius: "10px",
        }}
      >
        <Typography sx={{ textAlign: "center" }}>{message}</Typography>
        <Stack
          direction="row"
          sx={{ width: "200px", justifyContent: "space-between", gap: "20px" }}
        >
          <CustomButton
            onClick={() => {
              onConfirm();
              setConfirmationWindowValues(defaultConfirmationWindowValues);
            }}
            sx={{ ...confirmButtonStyling, width: "50%" }}
          >
            Confirm
          </CustomButton>
          <CustomButton
            onClick={onDecline}
            sx={{ ...declineButtonStyling, width: "50%" }}
          >
            Decline
          </CustomButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(ConfirmationWindow);
