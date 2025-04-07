import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { RevokedToken } from "../models/revokedTokens.model";
import { sendResetPasswordEmail, sendVerificationEmail } from "../services/email.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Cargar las variables de .env en process.env
dotenv.config();

const REFRESH_TOKEN_EXPIRATION_DAYS = 7;
const ACCESS_TOKEN_EXPIRATION_MINUTES = 15;
const MAX_FAILED_LOGIN_ATTEMPTS = 3;
const LOCK_TIME_LOGIN_MINUTES = 1;
const RESET_PASSWORD_EXPIRATION_MINUTES = 5;

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

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

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
        if (!passwordRegex.test(password)) {
            return next({ status: 400, message: "La contraseña debe tener al menos 5 caracteres y contener letras y números." });
        }

        const emailVerificationToken = jwt.sign(
            {email},
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        const newUser = await userService.createUser(name, email, password, emailVerificationToken);

        await sendVerificationEmail(email, emailVerificationToken);

        console.log(`Verificación de email -> http://localhost:3000/verify-email?token=${emailVerificationToken}`);

        res.status(201).json({ message: "Usuario registrado", usuario: newUser });
    } catch (error) {
        next(error);
    }
};

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email) {
            return next({ status: 400, message: "El correo es obligatorio." });
        }

        const user = await userService.getUserByEmail(email);
        if (!user) {
            return next({ status: 400, message: "Usuario no encontrado." });
        }

        if (user.isVerified) {
            return next({ status: 400, message: "El usuario ya está verificado." });
        }

        const emailVerificationToken = jwt.sign(
            {email},
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        user.emailVerificationToken = emailVerificationToken;
        await userService.saveUser(user);

        await sendVerificationEmail(email, emailVerificationToken);

        console.log(`Token de verificación de email -> ${emailVerificationToken}`);
        res.status(200).json({ message: "Se ha enviado un nuevo correo de verificación." });
    } catch (error) {
        next(error);
    }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;
        if (!token) {
            return next({ status: 400, message: "Token de verificación inválido." });
        }

        try {
            const decoded = jwt.verify(token as string, JWT_SECRET) as {email: string, exp: number};
    
            const user = await userService.getUserByEmail(decoded.email);
            if (!user || user.isVerified) {
                return next({ status: 400, message: "Token inválido o ya utilizado." });
            }
    
            user.isVerified = true;
            user.emailVerificationToken = null;
            await userService.saveUser(user);
    
            res.status(200).json({ message: "Correo verificado con éxito." });
        } catch (error) {
            if ((error as Error).name === "TokenExpiredError") {
                return next ({ status: 400, message: "El token de verificación ha expirado." });
            }
            return next({ status: 400, message: "Token inválido." });
        }

    } catch (error) {
        next(error);
    }
}

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

        if (!user.isVerified) {
            return next({ status: 400, message: "Debes verificar tu correo antes de iniciar sesión" });
        }

        if (user.lockedUntil && new Date() < user.lockedUntil) {
            return next({ status: 403, message: `Cuenta bloqueada. Inténtelo después de las ${user.lockedUntil.toLocaleTimeString()}` });
        }

        if (!(await bcrypt.compare(password, user.password))){
            user.failedLoginAttempts += 1;

            if (user.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
                user.lockedUntil = new Date(Date.now() + LOCK_TIME_LOGIN_MINUTES * 60 * 1000);
                await userService.saveUser(user);
                return next({ status: 403, message: `Cuenta bloqueada por demasiados intentos fallidos. Inténtelo de nuevo en ${LOCK_TIME_LOGIN_MINUTES} minutos` })
            }

            await userService.saveUser(user);
            if (user.failedLoginAttempts == 1) {
                return next({ status: 401, message: "Contraseña incorrecta" });
            } else {
                return next({ status: 401, message: `Contraseña incorrecta. Intentos restantes: ${MAX_FAILED_LOGIN_ATTEMPTS - user.failedLoginAttempts}` });
            }
            
        }

        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        await userService.saveUser(user);

        // Genera el token de acceso de corta duración
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: `${ACCESS_TOKEN_EXPIRATION_MINUTES}m` }
        );

        // Genera el token de refresco de larga duración
        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_REFRESH_SECRET,
            { expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d`}
        );

        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        await userService.saveUser(user);

        res.status(200).json({ message: "Inicio de sesión exitoso", usuario: user , tokenAcceso: token })
    } catch (error){
        next(error);
    }
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next({ status: 400, message: "No se proporcionó un Refresh Token." });
        }

        const user = await userService.getUserByRefreshToken(refreshToken);
        if (!user) {
            return next({ status: 403, message: "Refresh Token inválido." });
        }

        if (user.refreshTokenExpiresAt && new Date() > user.refreshTokenExpiresAt) {
            user.refreshToken = null;
            user.refreshTokenExpiresAt = null;
            await userService.saveUser(user);
            return next({ status: 403, message: "El Refresh Token ha expirado. Inicie sesión de nuevo." });
        }
        const accessToken = jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn: `${ACCESS_TOKEN_EXPIRATION_MINUTES}m` });

        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            return next({ status: 401, message: "No autorizado." });
        }

        const user = await userService.getUserById(req.user.id);
        if (!user) {
            return next({ status: 404, message: "Usuario no encontrado." });
        }

        const token = req.header("Authorization")?.split(" ")[1];
        if (token) {
            const revokedToken = new RevokedToken();
            revokedToken.token = token;
            await userService.saveRevokedToken(revokedToken);
        }

        user.refreshToken = null;
        await userService.saveUser(user);

        res.status(200).json({ message: "Sesión cerrada exitosamente." });
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return next({ status: 404, message: "Usuario no encontrado." });
        }
        
        const resetToken = jwt.sign({ id: user.id}, JWT_SECRET, { expiresIn: `${RESET_PASSWORD_EXPIRATION_MINUTES}m` });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = new Date(Date.now() + RESET_PASSWORD_EXPIRATION_MINUTES * 60 * 1000);
        await userService.saveUser(user);

        await sendResetPasswordEmail(email, resetToken);

        res.status(200).json({ message: "Correo enviado con instrucciones para restablecer la contraseña." });

        console.log(`🔗 Enlace de restablecimiento de contraseña: http://localhost:3000/reset-password?token=${resetToken}`);
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return next({ status: 400, message: "Debes introducir el token y una nueva contraseña." })
        }

        const user = await userService.getUserByResetToken(token);

        if (!user || !user.resetPasswordToken || user.resetPasswordToken !== token) {
            return next({ status: 400, message: "Token inválido o ya utilizado." });
        }

        if (user.resetPasswordExpiresAt && new Date() > user.resetPasswordExpiresAt) {
            return next({ status: 400, message: "El token ha expirado. Solicita uno nuevo." });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return next({ status: 400, message: "La nueva contraseña no puede ser igual a la anterior." });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
        if (!passwordRegex.test(newPassword)) {
            return next({ status: 400, message: "La contraseña debe tener al menos 5 caracteres y contener letras y números." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        const tokenAcceso = req.header("Authorization")?.split(" ")[1];
        if (tokenAcceso) {
            const revokedToken = new RevokedToken();
            revokedToken.token = tokenAcceso;
            await userService.saveRevokedToken(revokedToken);
        }

        user.refreshToken = null;
        user.refreshTokenExpiresAt = null;

        user.passwordChangedAt = new Date();

        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;

        await userService.saveUser(user);
        res.status(200).json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
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


export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(Number(id));
        if (!user) {
            return next({ status: 404, message: "Usuario no encontrado" });
        }
        res.status(200).json( { id: user.id, name: user.name, avatar: user.avatar, bio: user.bio } );
    } catch (error) {
        next(error);
    }
};


export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, avatar, bio } = req.body;

        const user = await userService.getUserById(Number(id));
        if (!user) {
            return next({ status: 404, message: "Usuario no encontrado" });
        }

        user.name = name;
        user.email = email;
        user.avatar = avatar;
        user.bio = bio;

        await userService.saveUser(user);

        res.status(200).json({ message: "Usuario actualizado", usuario: user });
    } catch (error) {
        next(error);
    }
};