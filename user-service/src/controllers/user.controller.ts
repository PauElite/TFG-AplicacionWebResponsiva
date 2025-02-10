import { Request, Response, RequestHandler, NextFunction } from "express";
import { userService } from "../services/user.service";

export const registerUser = (req: Request, res: Response, next: NextFunction): void => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return next({ status: 400, message: "Todos los campos son obligatorios" }); // Delegamos el error al middleware
    }

    try {
        const newUser = userService.createUser(nombre, email, password);
        res.status(201).json({ mensaje: "Usuario registrado", usuario: newUser });
    } catch (error) {
        next(error); // Cualquier error inesperado lo captura el middleware
    }
};

export const getAllUsers = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const users = userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};