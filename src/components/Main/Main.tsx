import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import Test from "../Test/Test";

export function Main() {
  return (
    <Box>
      <Typography>Welcome</Typography>
      <Link to="/projects">Projects</Link>
    </Box>
  );
}
