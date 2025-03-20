// app.ts
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import recipeRoutes from "./routes/recipe.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

// Middleware de CORS
app.use(
    cors({
        origin: "http://localhost:3000", // Permite solicitudes desde este origen
        credentials: true, // Permite el envío de credenciales (cookies, tokens, etc.)
    })
);

// Middleware de JSON
app.use(express.json());

// Rutas
app.use("/recetas", recipeRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));

export default app;