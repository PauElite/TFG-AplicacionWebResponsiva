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
      <body className="bg-gray-100 text-gray-900 min-h-screen bg-cover bg-fixed bg-center"
  style={{
    backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/020/919/511/non_2x/seamless-texture-with-of-hand-drawn-kitchen-utensils-can-be-used-for-wallpaper-pattern-fills-textile-web-page-background-surface-textures-illustration-kitchen-pattern-vector.jpg')",
  }}>
  <AuthProvider>
    <Navbar />
    <main className="container mx-auto px-4 pt-20 pb-8">{children}</main>
    <Footer />
  </AuthProvider>
</body>
    </html>
  );
}
