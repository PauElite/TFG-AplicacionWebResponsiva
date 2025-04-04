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
      <body className="text-gray-900 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow px-4 pt-10 pb-8">
            <div className="container mx-auto">{children}</div>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
