import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { User } from "./auth.model";
@Entity()
@Index("idx_session_user", ["userId"])
@Index("idx_session_refresh_token", ["refreshToken"])
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ length: 255 })
  refreshToken!: string;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  deviceInfo?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.sessions)
  user!: User;
}