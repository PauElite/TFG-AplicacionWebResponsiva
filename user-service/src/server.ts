import express from "express";
import userRoutes from "./routes/user.routes";
import { errorHandler} from "./middlewares/error.middleware"

const app = express();
app.use(express.json()); // Middleware para procesar JSON

// Aquí se registra el prefijo '/users' para todas las rutas definidas en userRoutes
app.use("/users", userRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT ||3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
