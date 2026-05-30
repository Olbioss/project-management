import {
  createProjectSchema,
  type Project,
  type SuccessResponse,
} from "@/shared/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppContext } from "../drizzle";
import { projectsTable } from "../db/schema";

export const projectRouter = new Hono<AppContext>()
  .get("/", async (c) => {
    const drizzle = c.get("drizzle");
    try {
      const projects = await drizzle.select().from(projectsTable).all();
      return c.json<SuccessResponse<Project[]>>(
        {
          success: true,
          message: "Projects fetched",
          data: projects as unknown as Project[],
        },
        200
      );
    } catch (err) {
      console.error(err);
    }
  })
  .post("/", zValidator("form", createProjectSchema), async (c) => {
    const drizzle = c.get("drizzle");
    const { name, description, startDate, endDate } = c.req.valid("form");
    try {
      const project = await drizzle.insert(projectsTable).values({
        name,
        description,
        startDate,
        endDate,
      }).returning();
      return c.json<SuccessResponse<Project>>(
        {
          success: true,
          message: "Project created",
          data: project as unknown as Project,
        },
        201
      );
    } catch (err) {
      console.error(err);
    }
  });
