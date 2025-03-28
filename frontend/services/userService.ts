import { apiUser } from "@/utils/apiUser";
import { User } from "@/types/user";

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

}

export const userService = new UserService();