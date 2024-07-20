import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Main } from "./components/Main/Main";
import { Projects } from "./components/Projects/Projects";
import { NoProjectsPlaceholder } from "./components/Projects/NoProjectsPlaceholder";
import { Tickets } from "./components/Tickets/Tickets";
import { Ticket } from "./components/Tickets/Ticket";
import { ProjectsContextProvider } from "./contexts/projectsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/projects",
        element: <Projects />,
        children: [
          { path: "/projects", element: <NoProjectsPlaceholder /> },
          {
            path: "/projects/:projectId/tickets",
            element: <Tickets />,
          },
          {
            path: "/projects/:projectId/tickets/:ticketId",
            element: <Ticket />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ProjectsContextProvider>
      <RouterProvider router={router} />
    </ProjectsContextProvider>
  );
}

export default App;
