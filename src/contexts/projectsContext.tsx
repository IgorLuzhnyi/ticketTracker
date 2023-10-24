import { useState, useContext, createContext, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

type ProjectsContextProviderProps = {
  children: ReactNode;
};

type Project = {
  id: string;
  projectName: string;
  tickets: Ticket[];
};

type Ticket = {
  id: string;
  ticketName: string;
  link: string;
  description: string;
  history: [];
};

type ProjectsContext = {
  projects: Project[];
  getProject: (projectId: string) => Project;
  addProject: (projectName: string) => void;
  removeProject: (projectId: string) => void;
  selectedProjectIndex: number | null;
  setSelectedProjectIndex: (projectIndex: number) => void;
  addTicket: (projectId: string, ticket: Ticket) => void;
  editTicket: (projectId: string, ticket: Ticket) => void;
  removeTicket: (projectId: string, ticketId: string) => void;
  selectedTicketIndex: number | null;
  setSelectedTicketIndex: (ticketIndex: number) => void;
};

const ProjectsContext = createContext({} as ProjectsContext);

export function useProjectsContext() {
  return useContext(ProjectsContext);
}

export function ProjectsContextProvider({
  children,
}: ProjectsContextProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    null | number
  >(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState<null | number>(
    null
  );

  function getProject(projectId: string) {
    return projects.find((project) => project.id === projectId) as Project;
  }

  function addProject(projectName: string) {
    setProjects([...projects, { projectName, id: uuidv4(), tickets: [] }]);
  }

  function removeProject(projectId: string) {
    setProjects(projects.filter((project) => project.id !== projectId));
  }

  function addTicket(projectId: string, ticket: Ticket) {
    const editedProject = projects.find(
      (project: Project) => project.id === projectId
    ) as Project;

    const editedProjectIndex = projects.indexOf(editedProject);

    const submittedProject = {
      ...editedProject,
      tickets: [...editedProject.tickets, ticket],
    };

    setProjects(projects.splice(editedProjectIndex, 1, submittedProject));
  }

  function editTicket(projectId: string, ticket: Ticket) {
    const editedProject = projects.find(
      (project: Project) => project.id === projectId
    ) as Project;
    const editedTicket = editedProject?.tickets.find(
      (curTicket: Ticket) => curTicket.id === ticket.id
    ) as Ticket;
    const editedProjectIndex = projects.indexOf(editedProject);
    const editedTicketIndex = editedProject.tickets.indexOf(editedTicket);

    const submittedTickets = editedProject.tickets.splice(
      editedTicketIndex,
      1,
      ticket
    );

    const submittedProject = { ...editedProject, tickets: submittedTickets };

    setProjects(projects.splice(editedProjectIndex, 1, submittedProject));
  }

  function removeTicket(projectId: string, ticketId: string) {
    const editedProject = projects.find(
      (project: Project) => project.id === projectId
    ) as Project;
    const editedProjectIndex = projects.indexOf(editedProject);

    const submittedTickets = editedProject.tickets.filter(
      (curTicket) => curTicket.id !== ticketId
    );

    const submittedProject = { ...editedProject, tickets: submittedTickets };

    setProjects(projects.splice(editedProjectIndex, 1, submittedProject));
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        getProject,
        addProject,
        removeProject,
        selectedProjectIndex,
        setSelectedProjectIndex,
        addTicket,
        editTicket,
        removeTicket,
        selectedTicketIndex,
        setSelectedTicketIndex,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
