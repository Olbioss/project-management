import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/* -------------------------------------------------------------------------- */
/*  Tables                                                                    */
/* -------------------------------------------------------------------------- */

export const usersTable = sqliteTable("users", {
  userId: integer("userId").primaryKey({ autoIncrement: true }),
  cognitoId: text("cognitoId").notNull().unique(),
  username: text("username").notNull().unique(),
  profilePictureUrl: text("profilePictureUrl"),
  teamId: integer("teamId").references(() => teamsTable.id),
});

export const teamsTable = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamName: text("teamName").notNull(),
  productOwnerUserId: integer("productOwnerUserId"),
  projectManagerUserId: integer("projectManagerUserId"),
});

export const projectsTable = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  startDate: text("startDate"),
  endDate: text("endDate"),
});

export const projectTeams = sqliteTable("project_teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("teamId")
    .notNull()
    .references(() => teamsTable.id),
  projectId: integer("projectId")
    .notNull()
    .references(() => projectsTable.id),
});

export const tasksTable = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status"),
  priority: text("priority"),
  tags: text("tags"),
  startDate: text("startDate"),
  dueDate: text("dueDate"),
  points: integer("points"),
  projectId: integer("projectId")
    .notNull()
    .references(() => projectsTable.id),
  authorUserId: integer("authorUserId")
    .notNull()
    .references(() => usersTable.userId),
  assignedUserId: integer("assignedUserId").references(() => usersTable.userId),
});

export const taskAssignments = sqliteTable("task_assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => usersTable.userId),
  taskId: integer("taskId")
    .notNull()
    .references(() => tasksTable.id),
});

export const attachments = sqliteTable("attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileURL: text("fileURL").notNull(),
  fileName: text("fileName"),
  taskId: integer("taskId")
    .notNull()
    .references(() => tasksTable.id),
  uploadedById: integer("uploadedById")
    .notNull()
    .references(() => usersTable.userId),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  taskId: integer("taskId")
    .notNull()
    .references(() => tasksTable.id),
  userId: integer("userId")
    .notNull()
    .references(() => usersTable.userId),
});

/* -------------------------------------------------------------------------- */
/*  Relations (enable db.query.<table>.findMany({ with: { ... } }))           */
/* -------------------------------------------------------------------------- */

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  team: one(teamsTable, { fields: [usersTable.teamId], references: [teamsTable.id] }),
  authoredTasks: many(tasksTable, { relationName: "TaskAuthor" }),
  assignedTasks: many(tasksTable, { relationName: "TaskAssignee" }),
  taskAssignments: many(taskAssignments),
  attachments: many(attachments),
  comments: many(comments),
}));

export const teamsRelations = relations(teamsTable, ({ many }) => ({
  user: many(usersTable),
  projectTeams: many(projectTeams),
}));

export const projectsRelations = relations(projectsTable, ({ many }) => ({
  tasks: many(tasksTable),
  projectTeams: many(projectTeams),
}));

export const projectTeamsRelations = relations(projectTeams, ({ one }) => ({
  team: one(teamsTable, {
    fields: [projectTeams.teamId],
    references: [teamsTable.id],
  }),
  project: one(projectsTable, {
    fields: [projectTeams.projectId],
    references: [projectsTable.id],
  }),
}));

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id],
  }),
  author: one(usersTable, {
    fields: [tasksTable.authorUserId],
    references: [usersTable.userId],
    relationName: "TaskAuthor",
  }),
  assignee: one(usersTable, {
    fields: [tasksTable.assignedUserId],
    references: [usersTable.userId],
    relationName: "TaskAssignee",
  }),
  taskAssignments: many(taskAssignments),
  attachments: many(attachments),
  comments: many(comments),
}));

export const taskAssignmentsRelations = relations(
  taskAssignments,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [taskAssignments.userId],
      references: [usersTable.userId],
    }),
    task: one(tasksTable, {
      fields: [taskAssignments.taskId],
      references: [tasksTable.id],
    }),
  })
);

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  task: one(tasksTable, { fields: [attachments.taskId], references: [tasksTable.id] }),
  uploadedBy: one(usersTable, {
    fields: [attachments.uploadedById],
    references: [usersTable.userId],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasksTable, { fields: [comments.taskId], references: [tasksTable.id] }),
  user: one(usersTable, { fields: [comments.userId], references: [usersTable.userId] }),
}));

/* -------------------------------------------------------------------------- */
/*  Inferred row types (handy in routers)                                     */
/* -------------------------------------------------------------------------- */

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Team = typeof teamsTable.$inferSelect;
export type NewTeam = typeof teamsTable.$inferInsert;
export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;
export type ProjectTeam = typeof projectTeams.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type NewTask = typeof tasksTable.$inferInsert;
export type TaskAssignment = typeof taskAssignments.$inferSelect;
export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
