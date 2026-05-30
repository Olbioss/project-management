import z from "zod";

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? unknown : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export const Priority = {
  Urgent: "Urgent",
  High: "High",
  Medium: "Medium",
  Low: "Low",
  Backlog: "Backlog",
} as const;
export type Priority = (typeof Priority)[keyof typeof Priority];

export const Status = {
  ToDo: "To Do",
  WorkInProgress: "Work In Progress",
  UnderReview: "Under Review",
  Completed: "Completed",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export type User = {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
};

export type Attachment = {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
};

export type Task = {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string | number | null;
  dueDate?: string | number | null;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
};

export type SearchResults = {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
};

export type Team = {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
};

export type Comment = {
  id: number;
  text: string;
  taskId: number;
  userId: number;
};

export const createProjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.enum([
    Status.ToDo,
    Status.WorkInProgress,
    Status.UnderReview,
    Status.Completed,
  ]),
  priority: z.enum([
    Priority.Urgent,
    Priority.High,
    Priority.Medium,
    Priority.Low,
    Priority.Backlog,
  ]),
  tags: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  // points: z.coerce.number().optional(),
  projectId: z.coerce.number().optional(),
  authorUserId: z.coerce.number(),
  assignedUserId: z.string().optional(),
});
