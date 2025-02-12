import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services/user.service";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next({ status: 401, message: "Acceso denegado. No hay token." });
    }

    const token = authHeader.split(" ")[1];

    const revokedToken = await userService.findRevokedToken(token);
    if (revokedToken) {
        return next({ status: 401, message: "Token invalidado. Inicie sesión de nuevo." })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next({ status: 401, message: "Token inválido o expirado." });
    }
}