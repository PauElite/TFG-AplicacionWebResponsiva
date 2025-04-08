"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { Toast } from "@/components/ui/Toast";
import { Anton } from "next/font/google";
import { Menu, X, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

// ... imports
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

export default function Navbar() {
  const { user, logout } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [navbarHeight, setNavbarHeight] = useState<number>(0);

  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        const height = navRef.current.getBoundingClientRect().height;
        setNavbarHeight(height);
      }
    };
    updateHeight(); // llamada inicial
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-[#8b5e3c] p-4 text-white shadow-md relative z-50"
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Logo + Título */}
        <div className="w-full md:w-auto text-center md:text-left flex items-center justify-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ElFogónRebeldeBlanco.png"
              alt="Logo El Fogón Rebelde"
              width={250}
              height={250}
              priority
            />
          </Link>
        </div>

        {/* Barra de búsqueda en md+ */}
        <div className="w-full md:w-auto flex justify-center md:justify-start mt-4 md:mt-0 md:mr-28">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-white text-black px-3 py-1 rounded-lg"
          >
            <input
              type="text"
              placeholder="Buscar recetas..."
              className="outline-none w-40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Botones menú y búsqueda en móvil */}
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button onClick={toggleSearch} className="md:hidden">
            <Search />
          </button>
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center gap-2 md:bg-white md:text-black md:px-4 md:py-2 md:rounded-lg md:hover:bg-blue-100"
          >
            {menuOpen ? <X /> : <Menu />}
            <span className="hidden md:inline">Menú</span>
          </button>
        </div>

        {/* Search móvil */}
        {searchOpen && (
          <form
            ref={searchRef}
            onSubmit={handleSearch}
            style={{ top: navbarHeight }}
            className="absolute md:hidden left-1/2 -translate-x-1/2 bg-white text-black rounded-lg px-4 py-2 shadow-md w-64 z-40"
          >
            <input
              type="text"
              placeholder="Buscar recetas..."
              className="outline-none w-full mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="w-full bg-[#8b5e3c] text-white rounded px-2 py-1">
              Buscar
            </button>
          </form>
        )}

        {/* Menú desplegable */}
        <div
          ref={menuRef}
          style={{ top: navbarHeight }}
          className={`absolute left-1/2 -translate-x-1/2 md:right-4 md:left-auto md:translate-x-0 bg-[#8b5e3c] rounded-lg shadow-lg flex flex-col items-center md:items-stretch transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? "block" : "hidden"} w-11/12 max-w-xs md:w-56 px-2 md:px-0 z-40`}
        >
          {user ? (
            <>
              <Link href={`/profile/${user.id}`} className="hover:bg-[#7a5233] py-2 px-4 w-full text-center">Perfil</Link>
              <Link
                href="/recipes/new"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    setToast("Debes iniciar sesión para subir una receta");
                  }
                }}
                className="hover:bg-[#7a5233] py-2 px-4 w-full text-center"
              >
                Subir mi propia receta
              </Link>
              <Link href="/recipes" className="hover:bg-[#7a5233] py-2 px-4 w-full text-center">Explorar recetas</Link>
              <Link href="/recipes/random" className="hover:bg-[#7a5233] py-2 px-4 w-full text-center">Cocina sorpresa</Link>
              <Link href="/recipes/world" className="hover:bg-[#7a5233] py-2 px-4 w-full text-center">Mapa del mundo</Link>
              <button
                onClick={logout}
                className="hover:bg-[#7a5233] py-2 px-4 w-full text-center"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:bg-[#7a5233] py-2 px-4 w-full text-center">
              Inicio de sesión / Registro
            </Link>
          )}
        </div>

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </nav>
  );
}
