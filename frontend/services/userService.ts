import { apiUser } from "@/utils/apiUser";
import { User } from "../../shared/models/user";

const API_URL = "http://localhost:3001/recetas/users";

class UserService {

    async getUserById(userId: number): Promise<User> {
        try {
            const response = await apiUser.get(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener el usuario", error);
            throw error;
        }
    }

    async updateUser(userId: number, userData: Partial<User>): Promise<User> {
        try {
            const response = await apiUser.put(`${API_URL}/${userId}`, userData);
            return response.data.usuario;
        } catch (error) {
            console.error("Error al actualizar el usuario", error);
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<string> {
        try {
            const response = await apiUser.post(`${API_URL}/forgot-password`, { email });
            return response.data.message;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message); // Lanza un error con el mensaje del backend
            } else {
                throw new Error("Error en el servidor, inténtelo más tarde");
            }
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<string> {
        try {
            const response = await apiUser.post(`${API_URL}/reset-password`, {
                token,
                newPassword,
            });

            return response.data.message;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message); // Lanza un error con el mensaje del backend
            } else {
                throw new Error("Error en el servidor, inténtelo más tarde");
            }
        }
    }

}

export const userService = new UserService();