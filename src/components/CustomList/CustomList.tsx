import { styled, List } from "@mui/material";
import { theme } from "../../theme";

export const CustomList = styled(List)({
  padding: "0 5px",
  overflow: "overlay",

  scrollbarGutter: "stable both-edges",
  "&::-webkit-scrollbar": {
    width: "10px",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: `${theme.palette.secondary.light}`,
  },

  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: `${theme.palette.secondary.main}`,
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: `${theme.palette.info.main}`,
  },
});
