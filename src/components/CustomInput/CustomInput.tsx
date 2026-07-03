import { TextField, styled } from "@mui/material";

const CustomInput = styled(TextField)(({ theme }) => ({
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
