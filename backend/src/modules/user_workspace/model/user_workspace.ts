import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { User } from "../../auth/model/user.model";
import { Workspace } from "../../workspace/model/workspace.model";

@Entity("user_workspaces")
@Index("idx_userworkspace_user", ["userId"])
@Index("idx_userworkspace_workspace", ["workspaceId"])
export class UserWorkspace {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  workspaceId!: number;

  @Column({ default: "member" })
  role!: string;

  @ManyToOne(() => User, user => user.userWorkspaces)
  user!: User;

  @ManyToOne(() => Workspace, workspace => workspace.userWorkspaces)
  workspace!: Workspace;

  @CreateDateColumn({ type: "timestamp" })
  joinedAt!: Date;
}