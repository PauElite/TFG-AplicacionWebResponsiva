import { AppDataSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async createUser(name: string, email: string, password: string): Promise<User> {
        // En primer lugar encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({ name, email, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({where: { email }})
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
}

export const userService = new UserService();