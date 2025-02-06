import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json()); // Middleware para procesar JSON

// Aquí se registra el prefijo '/users' para todas las rutas definidas en userRoutes
app.use("/users", userRoutes); // Registrar prefijo '/users' en todas las rutas definidas en '/routers/user.router'

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
