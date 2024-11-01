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
          mt: 1,
          mb: 1,
          pl: 1,
          pr: 1,
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
  }
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
  "&.MuiButtonBase-root:hover": {
    backgroundColor: "primary.main",
    borderColor: "secondary.main",
  },
};

export const declineButtonStyling = {
  color: "secondary.main",
  backgroundColor: "info.main",
  borderColor: "secondary.dark",

  "&.MuiButtonBase-root:hover": {
    backgroundColor: "secondary.main",
    color: "#fff",
    borderColor: "secondary.main",
  },
};
