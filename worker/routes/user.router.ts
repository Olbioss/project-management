import type { ErrorResponse, SuccessResponse, User } from "@/shared/types";
import { Hono } from "hono";
import type { AppContext } from "../drizzle";

export const userRouter = new Hono<AppContext>()
  .get("/", async (c) => {
    const drizzle = c.get("drizzle");
    try {
      const users = await drizzle.query.usersTable.findMany();
      return c.json<SuccessResponse<User[]>>(
        {
          success: true,
          message: "Users fetched",
          data: users as User[],
        },
        200
      );
    } catch (e) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: e instanceof Error ? e.message : "Failed to fetch users",
        },
        500
      );
    }
  })
  .post("/")
  .get("/:cognitoId");
