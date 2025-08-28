import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Workspace } from "../../workspace/model/workspace.model";
import { Task } from "../../task/model/task.model";

@Entity()
@Index("idx_project_workspace", ["workspaceId"])
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  workspaceId!: number;

  @ManyToOne(() => Workspace, workspace => workspace.projects)
  workspace!: Workspace;

  @OneToMany(() => Task, task => task.project)
  tasks!: Task[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Column({ default: false })
  isDeleted!: boolean;
}