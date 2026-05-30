import type { ErrorResponse, SuccessResponse } from "@/shared/types";
import { Hono } from "hono";
import type { AppContext } from "../drizzle";

export const teamRouter = new Hono<AppContext>().get("/", async (c) => {
  const drizzle = c.get("drizzle");
  try {
    const teams = await drizzle.query.teamsTable.findMany();

    const teamsWithUsers = await Promise.all(
      teams.map(async (team) => {
        const productOwner = await drizzle
          .query.usersTable
          .findFirst({
            where: (u, { eq }) => eq(u.userId, team.productOwnerUserId!)
          })
        const projectManager = await drizzle
          .query.usersTable
          .findFirst({
            where: (u, { eq }) => eq(u.userId, team.projectManagerUserId!)
          })

        return {
          ...team,
          productOwner: productOwner?.username,
          projectManager: projectManager?.username,
        };
      })
    );

    return c.json<SuccessResponse<typeof teamsWithUsers>>({
      success: true,
      message: "Teams fetched",
      data: teamsWithUsers,
    });
  } catch (e) {
    return c.json<ErrorResponse>(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to fetch users",
      },
      500
    );
  }
});
