import { TextField, styled } from "@mui/material";

const CustomInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    fontSize: 13,
    transform: "translate(14px, 9px) scale(1)",
  },

  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: 5,
    fontSize: 14,

    "&:not(.MuiInputBase-multiline)": {
      height: 36,
    },

    "& fieldset": {
      borderColor: theme.palette.secondary.light,
      borderWidth: 1,
    },

    "&:hover fieldset": {
      borderColor: theme.palette.secondary.main,
    },

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
    },

    "& input": {
      padding: "6px 12px",
    },
  },
}));

export default CustomInput;
