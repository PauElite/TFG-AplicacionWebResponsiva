import { Entity, PrimaryGeneratedColumn, Column, Check, OneToMany } from "typeorm";

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

// Definir la interfaz para un paso
interface Step {
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column("text", { array: true })
  ingredients!: string[];

  @Column("jsonb")
  instructions!: Step[]; // Array de objetos tipo "Paso"

  @Column("int")
  prepTime!: number;

  @Column("text", { array: true, nullable: true })
  suitableFor?: string[]; // ["airfrier", "horno"]

  @Column({
    type: "varchar",
    nullable: true,
    length: 1,  // Limitar la longitud a 1 carácter
  })
  @Check(`"difficulty" BETWEEN '1' AND '5'`)  // Restricción de valor entre 1 y 5
  difficulty!: string;

  @Column({ type: "varchar" })
  imageUrl!: string;

  @Column({ nullable: true })
  creatorId!: number;

  @Column({ type: "int", default: 0 })
  popularity!: number;
}
