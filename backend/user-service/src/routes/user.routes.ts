import { Request, Response, NextFunction, Router } from "express";
import { registerUser, loginUser, getAllUsers, getBasicUser, refreshAccessToken, logoutUser, resetPassword, forgotPassword, verifyEmail, resendVerificationEmail } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post("/register", registerUser); //Endpoint para registrar un usuario
router.post("/verify-email", verifyEmail); //Endpoint para verificar el email
router.post("/resend-verification-email", resendVerificationEmail); //Endpoint para reenviar el correo de verificación al email
router.post("/login", loginUser); //Endpoint para iniciar sesión
router.get("/", getAllUsers); //Endpoint para obtener todos los usuarios
router.get("/:id/name", getBasicUser); //Endpoint para obtener datos básicos de un usuario por ID
router.get("/perfil", authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ mensaje: "Ruta protegida", usuario: req.user });
}); //Endpoint para acceder al perfil habiendo iniciado sesión
router.post("/refresh", refreshAccessToken); //Endpoint para renovar el token de acceso
router.post("/logout", logoutUser); //Endpoint para cerrar sesión
router.post("/forgot-password", forgotPassword); //Endpoint para contraseña olvidada
router.post("/reset-password", authMiddleware, resetPassword); //Endpoint para restablecer la contraseña

export default router;