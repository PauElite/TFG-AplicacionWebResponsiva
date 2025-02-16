import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("❌ Error en el servidor:", err.message); // Imprimir error en consola

    res.status(err.status || 500).json({
        mensaje: err.message || "Error interno del servidor"
    });
};