import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { Task } from "../../task/model/task.model";
import { User } from "../../auth/model/auth.model";

@Entity()
@Index("idx_comment_task", ["taskId"])
@Index("idx_comment_author", ["authorId"])
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column()
  taskId!: number;

  @Column()
  authorId!: number;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Task, task => task.comments)
  task!: Task;

  @ManyToOne(() => User, user => user.comments)
  author!: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}