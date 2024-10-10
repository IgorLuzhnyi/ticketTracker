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
  const { sx, ...rest } = props;

  return (
    <TextField
      ref={ref}
      {...rest}
      size="small"
      slotProps={{
        inputLabel: {
          sx: {
            fontSize: "14px",
          },
        },
      }}
      sx={{
        ...sx,
        mr: 1,
        mb: 1,
        borderRadius: "none",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "secondary.main",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
      }}
    />
  );
});

export default CustomInput;
