import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Cargar las variables de .env en process.env
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next({ status: 400, message: "Todos los campos son obligatorios" });
        }

        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return next({ status: 400, message: "El email ya está en uso" });
        }

        const newUser = await userService.createUser(name, email, password);
        res.status(201).json({ mensaje: "Usuario registrado", usuario: newUser });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return next({ status: 400, message: "Todos los campos son obligatorios" }); 
        }

        const user = await userService.getUserByEmail(email);
        if (!user){
            return next({ status: 400, message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return next({ status: 400, message: "Contraseña incorrecta" });
        }

        // Genera el token que expirará en 1 hora
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ mensaje: "inicio de sesión exitoso", usuario: user , token: token})
    } catch (error){
        next(error);
    }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};