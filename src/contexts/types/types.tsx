import { ReactNode } from "react";

export type ProjectsContextProviderProps = {
  children: ReactNode;
};

export type Project = {
  projectId: string;
  projectName: string;
  tickets: Ticket[];
};

export type Ticket = {
  ticketId: string;
  createdAt: string;
  ticketName: string;
  ticketLinks: TicketLink[];
  ticketDescription: string;
  ticketHistory: TicketHistoryPost[];
};

export type TicketLink = {
  link: string;
  linkName: string;
  ticketLinkId: string;
};

export type TicketInputValues = {
  ticketName: string;
  ticketDescription: string;
  ticketLinks: TicketLink[];
};

export type TicketHistoryPost = {
  noteDate: Date;
  message: string;
  author: string;
};
