import { DataSource } from "typeorm";
import { User } from "../models/user.model"
import { RevokedToken } from "../models/revokedTokens.model";
import dotenv from "dotenv"

dotenv.config();
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: ["error", "warn"], // Para que la consola solo muestre errores y advertencias
    entities: [User, RevokedToken],
});

AppDataSource.initialize()
    .then(() => console.log("✅ Conexión a la base de datos establecida"))
    .catch((error) => console.error("❌ Error al conectar a la base de datos:", error));