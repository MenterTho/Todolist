import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { User } from "../../auth/model/auth.model";

export enum NotificationType {
  TASK_ASSIGN = "TASK_ASSIGN",
  COMMENT = "COMMENT",
  INVITE = "INVITE",
  WORKSPACE = "WORKSPACE",
  PROJECT = "PROJECT",
}

@Entity()
@Index("idx_notification_recipient", ["recipientId"])
@Index("idx_notification_type", ["type"])
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  recipientId!: number;

  @Column()
  message!: string;

  @Column({ type: "enum", enum: NotificationType })
  type!: NotificationType;

  @Column()
  relatedId!: number;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.notifications)
  recipient!: User;
}