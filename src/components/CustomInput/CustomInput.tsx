import { forwardRef } from "react";
import { TextField, TextFieldProps, styled } from "@mui/material";

const CustomInput = styled(
  forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
    <TextField size="small" {...props} ref={ref} />
  ))
)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    "& fieldset": {
      borderColor: theme.palette.secondary.light,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.secondary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default CustomInput;
