import { AppDataSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { RevokedToken } from "../models/revokedTokens.model";

export class UserService {
    private userRepository: Repository<User>;
    private revokedTokenRepository: Repository<RevokedToken>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.revokedTokenRepository = AppDataSource.getRepository(RevokedToken);
    }

    async createUser(name: string, email: string, password: string): Promise<User> {
        // En primer lugar encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({ name, email, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }
    
    async saveUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
    
    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({where: { email }})
    }

    async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { refreshToken }});
    }

    async getUserByResetToken(resetToken: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { resetPasswordToken: resetToken } })
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async saveRevokedToken(token: RevokedToken): Promise<RevokedToken> {
        return await this.revokedTokenRepository.save(token);
    }

    async findRevokedToken(token: string): Promise<RevokedToken | null> {
        return await this.revokedTokenRepository.findOne({ where: { token } });
    }
}

export const userService = new UserService();