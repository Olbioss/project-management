import { zValidator } from "@hono/zod-validator";
import { like, or } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
import { projectsTable, tasksTable, usersTable } from "../db/schema";
import type { AppContext } from "../drizzle";

export const searchRouter = new Hono<AppContext>().get(
  "/",
  zValidator("query", z.object({ query: z.string() })),
  async (c) => {
    const drizzle = c.get("drizzle");
    const { query } = c.req.valid("query");
    const term = `%${query}%`;
    try {
      const tasks = await drizzle
        .select()
        .from(tasksTable)
        .where(
          or(like(tasksTable.title, term), like(tasksTable.description, term))
        )

      const projects = await drizzle
        .select()
        .from(projectsTable)
        .where(
          or(
            like(projectsTable.name, term),
            like(projectsTable.description, term)
          )
        );

      const users = await drizzle
        .select()
        .from(usersTable)
        .where(like(usersTable.username, term));

      return c.json({ tasks, projects, users });
    } catch (e) {
      console.error(e);
    }
  }
);
