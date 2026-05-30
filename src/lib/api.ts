import type {
  ErrorResponse,
  Priority,
  Project,
  SearchResults,
  Status,
  SuccessResponse,
  Task,
  Team,
  User,
} from "@/shared/types";
import { hc } from "hono/client";
import type { ApiRoutes } from '../../worker/index'

const client = hc<ApiRoutes>("/").api;

export const getProjects = async () => {
  const res = await client.projects.$get()
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as SuccessResponse<Project[]>;
  return data;
};

export const createProject = async (
  name: string,
  description: string,
  startDate: string,
  endDate: string
) => {
  try {
    const res = await client.projects.$post({
      form: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse<Project>;
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};

export const getTasks = async (projectId: string) => {
  const res = await client.tasks.$get({
    query: { projectId }
  });
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as SuccessResponse<Task[]>;
  return data;
};

export const createTask = async ({
  title,
  description,
  status,
  priority,
  tags,
  startDate,
  dueDate,
  authorUserId,
  assignedUserId,
  projectId,
}: {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string;
  startDate: string;
  dueDate: string;
  authorUserId: string;
  assignedUserId: string;
  projectId: number;
}) => {
  try {
    const res = await client.tasks[":project_id"].$post({
      param: {
        project_id: projectId.toString(),
      },
      form: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        projectId: projectId.toString(),
        authorUserId,
        assignedUserId,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse<Task>;
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};

export const updateTaskStatus = async (taskId: number, status: Status) => {
  const res = await client.tasks[":taskId"].status.$patch({
    form: {
      status,
    },
    param: {
      taskId: taskId.toString(),
    },
  });
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as SuccessResponse<Task>;
  return data;
};

export const getSearh = async (query: string) => {
  const res = await client.search.$get({ query: { query } });
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as SearchResults;
  return data;
};

export const getUsers = async () => {
  const res = await client.users.$get();
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as SuccessResponse<User[]>;
  return data;
};

export const getTeams = async () => {
  const res = await client.teams.$get();
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as unknown as SuccessResponse<Team[]>;
  return data;
};

export const getTasksByUser = async (userId: string) => {
  const res = await client.tasks.user[":userId"].$get({
    param: {
      userId,
    },
  });
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = (await res.json()) as SuccessResponse<Task[]>;
  return data;
};
