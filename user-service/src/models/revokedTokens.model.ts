import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class RevokedToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", unique: true })
    token!: string;

    @CreateDateColumn()
    revokedAt!: Date;
}