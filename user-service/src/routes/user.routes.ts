import { Request, Response, Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post("/register", registerUser); //Endpoint para registrar un usuario
router.post("/login", loginUser); //Endpoint para iniciar sesion
router.get("/", getAllUsers); //Endpoint para obtener todos los usuarios
router.get("/perfil", authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ mensaje: "Ruta protegida", usuario: req.user });
});

export default router;