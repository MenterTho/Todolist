import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../modules/auth/model/auth.model";
import { Notification } from "../modules/notification/models/notification.model";
import { Task } from "../modules/task/model/task.model";
import { Project } from "../modules/project/model/project.model";
import { Workspace } from "../modules/workspace/model/workspace.model";
import { UserWorkspace } from "../modules/user_workspace/model/user_workspace.model";
import { Session } from "../modules/auth/model/session.model";
import { Comment } from "../modules/comment/model/comment.model";

dotenv.config();

let testDataSource: DataSource;

beforeAll(async () => {
  testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [User, Notification, Task, Comment, Project, Workspace, UserWorkspace, Session],
    synchronize: true,
    logging: false,
  });
  await testDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
});

afterEach(async () => {
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
});
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({}),
  }),
}));
jest.mock("cloudinary", () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: "http://mocked.url" }),
    },
  },
}));
jest.mock("firebase-admin", () => ({
  messaging: () => ({
    send: jest.fn().mockResolvedValue("sent"),
  }),
}));