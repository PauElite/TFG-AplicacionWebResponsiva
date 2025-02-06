import { Request, Response, RequestHandler } from "express";
import { userService } from "../services/user.service";

export const registerUser = (req: Request, res: Response): void => {
  try {
      const { nombre, email, password } = req.body;
      if (!nombre || !email || !password) {
          res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
      }

      const newUser = userService.createUser(nombre, email, password);
      res.status(201).json({ mensaje: "Usuario registrado", usuario: newUser });
  } catch (error) {
      res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const getAllUsers: RequestHandler = (req, res) => {
  try {
      const users = userService.getAllUsers();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};