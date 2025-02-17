import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(5, "Mínimo 5 caracteres"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await loginUser(data);
      navigate("/dashboard"); // Redirigir tras login exitoso
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Correo" className="border p-2" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        
        <input {...register("password")} type="password" placeholder="Contraseña" className="border p-2" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        
        <button type="submit" className="bg-blue-500 text-white p-2">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
