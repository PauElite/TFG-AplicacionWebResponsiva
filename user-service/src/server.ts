import express from "express";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";
import { errorHandler} from "./middlewares/error.middleware";

// Cargar las variables de .env en process.env
dotenv.config();

const app = express();
app.use(express.json()); // Middleware para procesar JSON

// Aquí se registra el prefijo '/users' para todas las rutas definidas en userRoutes
app.use("/users", userRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
