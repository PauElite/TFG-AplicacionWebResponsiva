import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Mi Aplicación",
  description: "Aplicación con autenticación en Next.js y Express",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
