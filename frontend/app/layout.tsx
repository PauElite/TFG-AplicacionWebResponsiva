import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Navbar from "../components/views/Navbar";
import Footer from "../components/views/Footer";

export const metadata: Metadata = {
  title: "El Fogón Rebelde",
  description: "Aplicación para compartir recetas de cocina"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className=" text-gray-900 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="bg-[#e0f2e9] flex-grow container mx-auto px-4 pt-20 pb-8 flex items-center justify-center">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
