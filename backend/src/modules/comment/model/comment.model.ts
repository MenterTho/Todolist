import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Task } from "../../task/model/task.model";
import { User } from "../../auth/model/auth.model";

@Entity()
@Index("idx_comment_task", ["taskId"])
@Index("idx_comment_author", ["authorId"])
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content!: string;

  @Column()
  taskId!: number;

  @Column()
  authorId!: number;

  @Column({ nullable: true })
  parentId?: number;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @ManyToOne(() => Task, task => task.comments, { onDelete: "CASCADE" })
  task!: Task;

  @ManyToOne(() => User, user => user.comments)
  author!: User;

  @ManyToOne(() => Comment, { nullable: true })
  parent?: Comment;
}