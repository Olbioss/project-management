import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ErrorResponse } from "../shared/types";
import { projectRouter } from "./routes/project.router";
import { searchRouter } from "./routes/search.router";
import { taskRouter } from "./routes/task.router";
import { teamRouter } from "./routes/team.router";
import { userRouter } from "./routes/user.router";
import type { AppContext } from "./drizzle";
import withDrizzle from "./drizzle";

const app = new Hono<AppContext>();

app.use("*", withDrizzle);

export const routes = app
  .basePath("/api")
  .route("/projects", projectRouter)
  .route("/tasks", taskRouter)
  .route("/search", searchRouter)
  .route("/users", userRouter)
  .route("/teams", teamRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errorResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === "object" && "form" in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status,
      );
    return errorResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        c.env.ENVIRONMENT === "production"
          ? "Internal Server Error"
          : (err.stack ?? err.message),
    },
    500,
  );
});

// The SPA is served by the Static Assets binding (see wrangler.jsonc `assets`).
// Asset + SPA-fallback requests are matched before the Worker runs, so Hono only
// handles `/api/*`. No serveStatic, no Bun export.
export default app;

export type ApiRoutes = typeof routes;
