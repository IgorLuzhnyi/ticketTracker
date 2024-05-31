import { useState, useContext, createContext, ReactNode } from "react";
import { useLocalStorage } from "../custom hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";

type ProjectsContextProviderProps = {
  children: ReactNode;
};

type Project = {
  projectId: string;
  projectName: string;
  tickets: Ticket[];
};

type TicketLink = {
  link: string;
  linkName: string;
};

type Ticket = {
  ticketId: string;
  createdAt: string;
  ticketName: string;
  links: TicketLink[];
  description: string;
  ticketHistory: TicketHistoryPost[];
};

export type TicketInputValues = {
  ticketName: string;
  links: TicketLink[];
  description: string;
};

export type TicketHistoryPost = {
  noteDate: Date;
  message: string;
  author: string;
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
  const { setItem, getItem } = useLocalStorage("PROJECTS");
  const [projects, setProjects] = useState<Project[]>(
    getItem() ? getItem() : []
  );
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    null | number
  >(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState<null | number>(
    null
  );

  function getProject(projectId: string) {
    return projects.find(
      (project) => project.projectId === projectId
    ) as Project;
  }

  function addProject(projectName: string) {
    setItem([...projects, { projectName, projectId: uuidv4(), tickets: [] }]);
    setProjects(getItem());
  }

  function removeProject(projectId: string) {
    setItem(projects.filter((project) => project.projectId !== projectId));
    setSelectedProjectIndex(null);
    setProjects(getItem());
  }

  function addTicket(projectId: string, ticket: Ticket) {
    const editedProject = projects.find(
      (project: Project) => project.projectId === projectId
    ) as Project;

    const editedProjectIndex = projects.indexOf(editedProject);

    const submittedProject = {
      ...editedProject,
      tickets: [...editedProject.tickets, ticket],
    };

    const updatedProjects = [
      ...projects.slice(0, editedProjectIndex),
      submittedProject,
      ...projects.slice(editedProjectIndex + 1),
    ];

    setProjects(updatedProjects);
  }

  function editTicket(projectId: string, ticket: Ticket) {
    const editedProject = projects.find(
      (project: Project) => project.projectId === projectId
    ) as Project;
    const editedTicket = editedProject?.tickets.find(
      (curTicket: Ticket) => curTicket.ticketId === ticket.ticketId
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
      (project: Project) => project.projectId === projectId
    ) as Project;
    const editedProjectIndex = projects.indexOf(editedProject);

    const submittedTickets = editedProject.tickets.filter(
      (curTicket) => curTicket.ticketId !== ticketId
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
