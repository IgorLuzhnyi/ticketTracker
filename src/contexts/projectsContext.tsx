import { useState, useContext, createContext } from "react";
import { useLocalStorage } from "../custom hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import {
  ProjectsContextProviderProps,
  Project,
  Ticket,
  TicketLink,
  TicketHistoryPost,
} from "./types/types";
import { ticketActions } from "../constants/constants";

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
    action: string | null,
    projectId: string,
    ticketId: string,
    ticketLinkId: string | null,
    editableAttribute: string,
    updatedValue: string | TicketLink[]
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
    action: string | null,
    projectId: string,
    ticketId: string,
    currentTicketLinkId: string | null,
    editableAttribute: string,
    updatedValue: string | TicketLink[]
  ) {
    const editedProject = projects.find(
      (project: Project) => project.projectId === projectId
    ) as Project;
    const editedTicket = editedProject?.tickets.find(
      (curTicket: Ticket) => curTicket.ticketId === ticketId
    ) as Ticket;
    const editedProjectIndex = projects.indexOf(editedProject);
    const editedTicketIndex = editedProject.tickets.indexOf(editedTicket);

    let updatedTicket;

    switch (action) {
      case ticketActions.editingTicketMainData:
        updatedTicket = {
          ...projects[editedProjectIndex].tickets[editedTicketIndex],
          [editableAttribute]: updatedValue,
        };
        break;
      case ticketActions.editingLink:
        if (typeof updatedValue !== "string") {
          const updatedTicketLinkData = {
            ...updatedValue.filter((ticketLinkData) => ticketLinkData)[0],
            ticketLinkId: currentTicketLinkId,
          };
          updatedTicket = {
            ...projects[editedProjectIndex].tickets[editedTicketIndex],
            ticketLinks: projects[editedProjectIndex].tickets[
              editedTicketIndex
            ].ticketLinks.map((ticketLinkData) =>
              ticketLinkData.ticketLinkId === currentTicketLinkId
                ? updatedTicketLinkData
                : ticketLinkData
            ),
          };
        }
        break;
    }

    const updatedProject = {
      ...projects[editedProjectIndex],
      tickets: [
        ...projects[editedProjectIndex].tickets.slice(0, editedTicketIndex),
        updatedTicket,
        ...projects[editedProjectIndex].tickets.slice(editedTicketIndex + 1),
      ],
    };

    const updatedProjects = projects.map((project, i) =>
      i !== editedProjectIndex ? project : updatedProject
    );

    setItem(updatedProjects);
    setProjects(getItem());
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
