import { User } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";

export class UserService {
    private users: User[] = []; // Simulación de base de datos en memoria

    createUser(nombre: string, email: string, password: string): User {
        const newUser = new User(uuidv4(), nombre, email, password);
        this.users.push(newUser);
        return newUser;
    }

    getAllUsers(): User[] {
        return this.users;
    }
}

export const userService = new UserService();