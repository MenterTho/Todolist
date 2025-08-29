import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Project } from "../../project/model/project.model";
import { User } from "../../auth/model/auth.model";
import { Comment } from "../../comment/model/comment.model";

@Entity()
@Index("idx_task_project", ["projectId"])
@Index("idx_task_assignee", ["assigneeId"])
@Index("idx_task_status", ["status"])
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: "To Do" })
  status!: string;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  priority?: string;

  @Column()
  projectId!: number;

  @Column({ nullable: true })
  assigneeId?: number;

  @Column()
  creatorId!: number;

  @ManyToOne(() => Project, project => project.tasks)
  project!: Project;

  @ManyToOne(() => User, user => user.assignedTasks)
  assignee?: User;

  @ManyToOne(() => User, user => user.createdTasks)
  creator!: User;

  @OneToMany(() => Comment, comment => comment.task)
  comments!: Comment[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Column({ default: false })
  isDeleted!: boolean;
}