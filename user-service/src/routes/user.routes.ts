import { Router } from "express";
import { registerUser, getAllUsers } from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser); //Endpoint para registrar un usuario
router.get("/", getAllUsers); //Endpoint para obtener todos los usuarios

export default router;