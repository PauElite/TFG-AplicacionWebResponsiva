import { DataSource } from "typeorm";
import { User } from "../models/user.model"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "pau",  // Cambia esto
    password: "7538", // Cambia esto
    database: "recetas", // Cambia esto
    synchronize: true,
    logging: ["error", "warn"], // Para que la consola solo muestre errores y advertencias
    entities: [User],
});

AppDataSource.initialize()
    .then(() => console.log("✅ Conexión a la base de datos establecida"))
    .catch((error) => console.error("❌ Error al conectar a la base de datos:", error));