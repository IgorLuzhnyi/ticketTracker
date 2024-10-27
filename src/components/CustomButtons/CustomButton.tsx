import { forwardRef } from "react";
import { Button, ButtonProps } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface CustomButtonProps extends ButtonProps {
  sx?: SxProps<Theme>;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ sx, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        {...rest}
        size="small"
        variant="outlined"
        sx={{
          ...sx,
          mt: 1,
          mb: 1,
          "&:hover": {
            backgroundColor: "primary.main",
            borderColor: "primary.dark",
            color: "white",
          },
        }}
      >
        {children}
      </Button>
    );
  }
);

export const confirmButtonStyling = {
  backgroundColor: "success.main",
  color: "#fff",
  borderColor: "success.main",
  "&.MuiButtonBase-root:hover": {
    backgroundColor: "primary.main",
    borderColor: "secondary.main",
  },
};

export const declineButtonStyling = {
  color: "secondary.main",
  backgroundColor: "info.main",
  borderColor: "secondary.main",

  "&.MuiButtonBase-root:hover": {
    backgroundColor: "secondary.main",
    color: "#fff",
    borderColor: "secondary.main",
  },
};
