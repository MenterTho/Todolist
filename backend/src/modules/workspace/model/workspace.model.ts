import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { User } from "../../auth/model/auth.model";
import { Project } from "../../project/model/project.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace";

@Entity()
@Index("idx_workspace_owner", ["ownerId"])
export class Workspace {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  ownerId!: number;

  @ManyToOne(() => User, user => user.userWorkspaces)
  owner!: User;

  @OneToMany(() => UserWorkspace, userWorkspace => userWorkspace.workspace)
  userWorkspaces!: UserWorkspace[];

  @OneToMany(() => Project, project => project.workspace)
  projects!: Project[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Column({ default: false })
  isDeleted!: boolean;
}