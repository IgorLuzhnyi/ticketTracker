import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Main } from "./components/Main/Main";
import { Ticket } from "./components/Ticket/Ticket";
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
        path: "/:id",
        element: <Ticket />,
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
