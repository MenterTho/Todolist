import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Task } from "../../task/model/task.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace.model";
import { Comment } from "../../comment/model/comment.model";
import { Notification } from "../../notification/models/notification.model";
import { Session } from "./session.model";
import { Exclude } from "class-transformer";
@Entity()
@Index("idx_user_email", ["email"])
@Index("idx_user_phone", ["phoneNumber"])
@Index("idx_user_role", ["role"])
@Index("idx_user_reset_token", ["resetToken"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Exclude() //hide
  @Column({ length: 255 })
  password!: string;

  @Column({ length: 100 })
  name!: string;

  // @Column({ length: 255, nullable: true })
  // fcmToken?: string; // FCM

  @Column({ unique: true, length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ default: "member" })
  role!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastLogin?: Date;

  @Column({ length: 255, nullable: true })
  resetToken?: string;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpiresAt?: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Column({ default: false })
  isDeleted!: boolean;

  // Mối quan hệ
  @OneToMany(() => Task, task => task.assignee)
  assignedTasks!: Task[];

  @OneToMany(() => Task, task => task.creator)
  createdTasks!: Task[];

  @OneToMany(() => UserWorkspace, userWorkspace => userWorkspace.user)
  userWorkspaces!: UserWorkspace[];

  @OneToMany(() => Comment, comment => comment.author)
  comments!: Comment[];

  @OneToMany(() => Notification, notification => notification.recipient)
  notifications!: Notification[];

  @OneToMany(() => Session, session => session.user)
  sessions!: Session[];
}