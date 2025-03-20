import { Entity, PrimaryGeneratedColumn, Column, Check } from "typeorm";

// Definir la interfaz para un paso
interface Paso {
  title: string;
  description: string;
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
  instructions!: Paso[]; // Array de objetos tipo "Paso"

  @Column("int")
  prepTime!: number;

  @Column({ 
    type: "varchar", 
    nullable: true, 
    length: 1,  // Limitar la longitud a 1 carácter
  })
  @Check(`"difficulty" BETWEEN '1' AND '5'`)  // Restricción de valor entre 1 y 5
  difficulty?: string;

  @Column({ type: "varchar", nullable: true })
  imageUrl?: string;
}
