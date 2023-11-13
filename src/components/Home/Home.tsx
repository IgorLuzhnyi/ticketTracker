import { Stack, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import TestComponent from "../Test/Test";

export function Home() {
  return (
    <Stack
      sx={{
        maxWidth: "1920px",
        height: "100vh",
        margin: "0 auto",
        backgroundColor: "primary.main",
      }}
    >
      <Stack direction="row" sx={{ p: 2, justifyContent: "space-between" }}>
        <Typography variant="h4">Ticket Tracker</Typography>
        {/* <img src="data:image/png;base64,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" /> */}
      </Stack>
      <Outlet />
      <Typography sx={{ textAlign: "center", mt: "auto" }}>
        Created for internal usage
      </Typography>
      {/* <TestComponent /> */}
    </Stack>
  );
}
