import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(["userId", "recipeId"]) // Un usuario solo puede votar una vez por receta
export class RecipeVote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  recipeId!: number;

  @Column({ type: "int" })
  value!: 1 | -1;
}
