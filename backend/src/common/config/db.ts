import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../modules/auth/model/auth.model";
import { Session } from "../../modules/auth/model/session.model";
import { Workspace } from "../../modules/workspace/model/workspace.model";
import { UserWorkspace } from "../../modules/user_workspace/model/user_workspace";
import { Project } from "../../modules/project/model/project.model";
import { Task } from "../../modules/task/model/task.model";
import { Comment } from "../../modules/comment/model/comment.model";
import { Notification } from "../../modules/notification/models/notification.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "tuantho123",
  database: process.env.DB_NAME || "todolist",
  entities: [User, Session, Workspace, UserWorkspace, Project, Task, Comment, Notification],
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