import { Grid, Box } from "@mui/material";
import { Projects } from "../Projects/Projects";
import { Tickets } from "../Tickets/Tickets";

export function Main() {
  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
      sx={{ p: 2 }}
    >
      <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
        <Projects />
      </Grid>
      <Grid item xl={9} lg={9} md={9} sm={9} xs={9}>
        <Box
          sx={{
            p: 2,
            borderRadius: ".5rem",
            backgroundColor: "info.light",
          }}
        >
          <Tickets />
        </Box>
      </Grid>
    </Grid>
  );
}
