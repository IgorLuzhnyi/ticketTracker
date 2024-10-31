import { Stack, Typography, Link, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import websiteLogo from "../../assets/ticket-tracker-logo.svg";
import ConfirmationWindow from "../ConfirmationWindow/ConfirmationWindow";
import { useProjectsContext } from "../../contexts/projectsContext";
// import TestComponent from "../Test/Test";

export function Home() {
  const { confirmationWindowValues } = useProjectsContext();

  return (
    <Stack
      sx={{
        maxWidth: "1920px",
        height: "100vh",
        margin: "0 auto",
        backgroundColor: "primary.main",
      }}
    >
      <ConfirmationWindow values={confirmationWindowValues} />
      <Stack direction="row" sx={{ p: 2, justifyContent: "space-between" }}>
        <Link href="/projects" variant="h4" sx={{ color: "black" }}>
          <Box
            component="img"
            src={websiteLogo}
            alt="website logo"
            sx={{ width: 200, height: "auto" }}
          />
        </Link>
      </Stack>
      <Outlet />
      <Typography sx={{ textAlign: "center", mt: "auto" }}>
        Created for internal usage
      </Typography>
      {/* <TestComponent /> */}
    </Stack>
  );
}
