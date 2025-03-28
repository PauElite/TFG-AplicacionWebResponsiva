import axios from "axios";
import { User } from "@/types/user";

const API_URL = "http://localhost:3001/recetas/users";

class UserService {

    async getUserById(userId: number): Promise<User> {
        try {
            const response = await axios.get(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener el usuario", error);
            throw error;
        }
    }

}

export const userService = new UserService();