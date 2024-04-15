import { TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

interface CustomInputProps {
  label: string;
  style?: object;
  error?: boolean;
}

const CustomInput = forwardRef<
  HTMLInputElement,
  CustomInputProps & TextFieldProps
>((props, ref) => {
  return (
    <TextField
      ref={ref}
      {...props}
      variant="outlined"
      sx={{
        backgroundColor: "primary.light",
        mr: 1,
        mb: 1,
      }}
    />
  );
});

export default CustomInput;
