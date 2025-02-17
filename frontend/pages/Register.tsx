import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email("Correo inválido"),
  password: z.string().min(5, "Mínimo 5 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else{
        setError("Error al registrar");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Registro</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="Nombre" className="border p-2" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register("email")} placeholder="Correo" className="border p-2" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input {...register("password")} type="password" placeholder="Contraseña" className="border p-2" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <input {...register("confirmPassword")} type="password" placeholder="Confirmar Contraseña" className="border p-2" />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

        <button type="submit" className="bg-green-500 text-white p-2">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
