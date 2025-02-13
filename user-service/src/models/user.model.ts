import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: "text", nullable: true })
    resetPasswordToken!: string | null;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpiresAt!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    passwordChangedAt!: Date | null;

    @Column({ default: 0 })
    failedLoginAttempts!: number;

    @Column({ type: "timestamp", nullable: true })
    lockedUntil!: Date | null;

    @Column({ type: "text", nullable: true })
    refreshToken?: string | null;

    @Column({ type: "timestamp", nullable: true })
    refreshTokenExpiresAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date; 
}