import "reflect-metadata";
import { DataSource } from "typeorm";
// import { User } from "../modules/auth/models/user.models";
// import { Session } from "../modules/auth/models/session.models";
// import { Workspace } from "../modules/workspace/models/workspace.models";
// import { UserWorkspace } from "../modules/workspace/models/user-workspace.models";
// import { Project } from "../modules/project/models/project.models";
// import { Task } from "../modules/task/models/task.models";
// import { Comment } from "../modules/comment/models/comment.models";
// import { Notification } from "../modules/notification/models/notification.models";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "tuantho123",
  database: process.env.DB_NAME || "todolist",
  // entities: [User, Session, Workspace, UserWorkspace, Project, Task, Comment, Notification],
  synchronize: true, 
});

export const initDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
};