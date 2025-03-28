"use client";

import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfileEditPage() {
    const { user: currentUser, updateUser } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<User>>({
        name: "",
        avatar: "",
        bio: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Cargar datos iniciales
    useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            if (currentUser) {
                setFormData({
                    name: currentUser.name || "",
                    avatar: currentUser.avatar || "avatar1",
                    bio: currentUser.bio || ""
                });
                setLoading(false);
            }
        }
        loadUserData();
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!currentUser?.id) return;

            const updatedUser = await userService.updateUser(currentUser.id, formData);
            await updateUser(updatedUser); // Actualizar contexto de autenticación
            router.push(`/profile/${currentUser.id}`);
        } catch (err) {
            setError("Error al actualizar el perfil");
            console.error(err);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!currentUser) return <div>No autenticado</div>;

    return (
        <ProtectedRoute>
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-green-600">Editar Perfil</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Campo Nombre */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                {/* Selector de Avatar */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Avatar</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(num => (
                            <label key={num} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="avatar"
                                    value={`avatar${num}`}
                                    checked={formData.avatar === `avatar${num}`}
                                    onChange={handleChange}
                                    className="hidden peer"
                                />
                                <img
                                    src={`/avatares/avatar${num}.webp`}
                                    alt={`Avatar ${num}`}
                                    className="w-16 h-16 rounded-full border-2 peer-checked:border-green-500 object-cover"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Campo Biografía */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Biografía</label>
                    <textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
        </ProtectedRoute>
    );
}