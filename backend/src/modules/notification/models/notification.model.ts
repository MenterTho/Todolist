import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { User } from "../../auth/model/auth.model";

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

  @Column()
  type!: string;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.notifications)
  recipient!: User;
}