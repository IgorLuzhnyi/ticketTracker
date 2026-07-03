import { forwardRef } from "react";
import { Button, ButtonProps } from "@mui/material";

export const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ sx, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        {...rest}
        size="small" // this forces the CustomButton to always be small. change if needed
        variant="outlined"
        sx={{
          py: 0,
          px: 1,
          alignSelf: "start",
          "&:hover": {
            backgroundColor: "primary.main",
            borderColor: "primary.dark",
            color: "white",
          },
          ...sx,
        }}
      >
        {children}
      </Button>
    );
  },
);

export const alternativeButtonStyling = {
  color: "secondary.main",
  backgroundColor: "info.main",
  borderColor: "secondary.main",

  "&:hover": {
    color: "info.main",
    backgroundColor: "secondary.main",
    borderColor: "secondary.main",
  },
};

export const confirmButtonStyling = {
  backgroundColor: "success.main",
  color: "#fff",
  borderColor: "success.main",

  "&:hover": {
    backgroundColor: "primary.main",
    borderColor: "secondary.main",
  },
};

export const declineButtonStyling = {
  color: "secondary.main",
  backgroundColor: "info.main",
  borderColor: "secondary.dark",

  "&:hover": {
    color: "#fff",
    backgroundColor: "secondary.main",
    borderColor: "secondary.main",
  },
};
