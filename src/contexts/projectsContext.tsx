import { useState, useContext, createContext, ReactNode } from "react";
import { useLocalStorage } from "../custom hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import { TICKET_ATTRIBUTES } from "../constants/constants";

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
  editProject: (projectName: string, projectIndex: number) => void;
  removeProject: (projectId: string) => void;
  selectedProjectIndex: number | null;
  setSelectedProjectIndex: (projectIndex: number) => void;
  addTicket: (projectId: string, ticket: Ticket) => void;
  updateTicket: (
    projectId: string,
    ticketId: string,
    editableAttribute: string,
    ticketName: string
  ) => void;
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

  function editProject(projectName: string, projectIndex: number) {
    const updatedProjects = projects.map((project, i) =>
      i !== projectIndex ? project : { ...project, projectName }
    );

    setItem(updatedProjects);
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

    setItem(updatedProjects);
    setProjects(getItem());
  }

  function updateTicket(
    projectId: string,
    ticketId: string,
    editableAttribute: string,
    ticketName: string
  ) {
    const editedProject = projects.find(
      (project: Project) => project.projectId === projectId
    ) as Project;
    const editedTicket = editedProject?.tickets.find(
      (curTicket: Ticket) => curTicket.ticketId === ticketId
    ) as Ticket;
    const editedProjectIndex = projects.indexOf(editedProject);
    const editedTicketIndex = editedProject.tickets.indexOf(editedTicket);

    // HERE SHOULD ADD THE LOGIC DEPENDING ON EDITABLEATTRIBUTE
    switch (editableAttribute) {
      case TICKET_ATTRIBUTES.ticketName: {
        const updatedTicket = {
          ...projects[editedProjectIndex].tickets[editedTicketIndex],
          ticketName,
        };
        const updatedProject = {
          ...projects[editedProjectIndex],
          tickets: [
            ...projects[editedProjectIndex].tickets.slice(0, editedTicketIndex),
            updatedTicket,
            ...projects[editedProjectIndex].tickets.slice(
              editedTicketIndex + 1
            ),
          ],
        };

        const updatedProjects = projects.map((project, i) =>
          i !== editedProjectIndex ? project : updatedProject
        );

        setItem(updatedProjects);
        setProjects(getItem());
      }
    }
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

    const updatedProjects = projects.map((project, i) =>
      i !== editedProjectIndex ? project : submittedProject
    );

    setItem(updatedProjects);
    setProjects(getItem());
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        getProject,
        addProject,
        editProject,
        removeProject,
        selectedProjectIndex,
        setSelectedProjectIndex,
        addTicket,
        updateTicket,
        removeTicket,
        selectedTicketIndex,
        setSelectedTicketIndex,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
