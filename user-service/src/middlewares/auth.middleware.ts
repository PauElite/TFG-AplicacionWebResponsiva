import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization");

    if (!token) {
        return next({ status: 401, message: "Acceso denegado. No hay token." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next({ status: 401, message: "Token inválido o expirado." });
    }
}