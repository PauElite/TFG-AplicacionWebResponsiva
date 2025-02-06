import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user.routes"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes)


export default app;