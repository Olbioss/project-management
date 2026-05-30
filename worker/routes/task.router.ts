import {
  createTaskSchema,
  Status,
  type ErrorResponse,
  type SuccessResponse,
  type Task,
} from "@/shared/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import type { AppContext } from "../drizzle";
import { tasksTable, usersTable } from "../db/schema";
import { eq} from "drizzle-orm";

export const taskRouter = new Hono<AppContext>()
  .get(
    "/",
    zValidator("query", z.object({ projectId: z.coerce.number() })),
    async (c) => {
      const drizzle = c.get("drizzle");
      const { projectId } = c.req.valid("query");
      try {
        const tasks = await drizzle.query.tasksTable.findMany({
          where: (tasks, { eq }) => eq(tasks.projectId, projectId),
          with: {
            author: true,
            assignee: true,
            comments: true,
            attachments: true,
          },
        })
        return c.json<SuccessResponse<Task[]>>(
          {
            success: true,
            message: "Tasks fetched",
            data: tasks as Task[],
          },
          200
        );
      } catch (err) {
        console.error(err);
        return c.json<ErrorResponse>(
          {
            success: false,
            error: err instanceof Error ? err.message : "Failed to fetch tasks",
          },
          500
        );
      }
    }
  )
  .post(
    "/:project_id",
    zValidator("param", z.object({ project_id: z.coerce.number() })),
    zValidator("form", createTaskSchema),
    async (c) => {
      const drizzle = c.get("drizzle");
      const { project_id } = c.req.valid("param");
      const {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        projectId,
        authorUserId,
        assignedUserId,
      } = c.req.valid("form");
      try {
        // Safely handle optional assignedUserId from the form
        let validAssignedUserId: number | null = null;

        if (assignedUserId !== undefined && assignedUserId !== "") {
          const parsed = Number(assignedUserId);

          if (Number.isNaN(parsed)) {
            return c.json<ErrorResponse>(
              {
                success: false,
                error: "Assigned user ID must be a valid number",
                isFormError: true,
              },
              400
            );
          }

          // Ensure the referenced user actually exists to avoid FK errors
          // const existingUser = await drizzle.query.usersTable.findFirst({
          //   where: (u, { eq }) => eq(u.userId, parsed)
          // })
          const [existingUser] = await drizzle
            .select()
            .from(usersTable)
            .where(eq(usersTable.userId, parsed))
            .limit(1);

          if (!existingUser) {
            return c.json<ErrorResponse>(
              {
                success: false,
                error: "Assigned user not found",
                isFormError: true,
              },
              400
            );
          }

          validAssignedUserId = parsed;
        }

        const validProjectId = project_id !== null;

        const [task] = await drizzle.insert(tasksTable).values({
          title,
          description,
          status,
          priority,
          tags,
          startDate,
          dueDate,
          authorUserId,
          assignedUserId: validAssignedUserId,
          projectId: (validProjectId ? project_id : projectId)!,
        }).returning()
        return c.json<SuccessResponse<Task>>(
          {
            success: true,
            message: "Task created",
            data: task as Task,
          },
          201
        );
      } catch (err) {
        console.error(err);
        return c.json<ErrorResponse>(
          {
            success: false,
            error: err instanceof Error ? err.message : "Failed to create task",
          },
          500
        );
      }
    }
  )
  .patch(
    "/:taskId/status",
    zValidator("param", z.object({ taskId: z.coerce.number() })),
    zValidator(
      "form",
      z.object({
        status: z.enum([
          Status.ToDo,
          Status.WorkInProgress,
          Status.UnderReview,
          Status.Completed,
        ]),
      })
    ),
    async (c) => {
      const drizzle = c.get("drizzle");
      const { taskId } = c.req.valid("param");
      const { status } = c.req.valid("form");
      try {
        const [updatedTask] = await drizzle
          .update(tasksTable)
          .set({ status })
          .where(eq(tasksTable.id, Number(taskId)))
          .returning()

        return c.json<SuccessResponse<Task>>(
          {
            success: true,
            message: "Task status updated",
            data: updatedTask as Task,
          },
          200
        );
      } catch (err) {
        console.error(err);
        return c.json<ErrorResponse>(
          {
            success: false,
            error:
              err instanceof Error
                ? err.message
                : "Failed to update task status",
          },
          500
        );
      }
    }
  )
  .get(
    "/user/:userId",
    zValidator("param", z.object({ userId: z.coerce.number() })),
    async (c) => {
      const drizzle = c.get("drizzle");
      const { userId } = c.req.valid("param");
      try {
        const tasks = await drizzle.query.tasksTable.findMany({
          where: (t, { or, eq }) => or(
            eq(t.authorUserId, Number(userId)),
            eq(t.assignedUserId, Number(userId))
          ),
          with: {
            author: true,
            assignee: true,
          },
        });
        return c.json<SuccessResponse<Task[]>>(
          {
            success: true,
            message: "Tasks fetched",
            data: tasks as Task[],
          },
          200
        );
      } catch (err) {
        console.error(err);
        return c.json<ErrorResponse>(
          {
            success: false,
            error: err instanceof Error ? err.message : "Failed to fetch tasks",
          },
          500
        );
      }
    }
  );
