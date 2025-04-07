import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = [
  {
    label: "AirFrier",
    value: "airfrier",
    icon: "https://img.icons8.com/external-filled-line-andi-nur-abdillah/64/external-Air-Fryer-home-appliances-(filled-line)-filled-line-andi-nur-abdillah.png",
  },
  {
    label: "Horno",
    value: "horno",
    icon: "https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/external-oven-kitchen-kiranshastry-lineal-color-kiranshastry.png",
  },
];

export const RecipeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const values = searchParams.getAll("suitableFor");
    setSelected(values);
    const searchValue = searchParams.get("search") || "";
    setSearch(searchValue);
  }, [searchParams]);

  const updateURL = (filters: string[], searchText: string) => {
    const params = new URLSearchParams();
    filters.forEach((val) => params.append("suitableFor", val));
    if (searchText.trim()) params.set("search", searchText);
    router.push(`/?${params.toString()}`);
  };

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    updateURL(newSelected, search);
  };

  const clearFilters = () => {
    setSelected([]);
    setSearch("");
    router.push("/");
  };

  const removeSingleFilter = (value: string) => {
    const newSelected = selected.filter((v) => v !== value);
    setSelected(newSelected);
    updateURL(newSelected, search);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    updateURL(selected, value);
  };

  return (
    <div className="w-full max-w-6xl mb-6 flex flex-col gap-4">
      {/* Input de búsqueda */}
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Buscar por título o ingredientes..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white focus:ring-green-300"
      />

<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
        {/* Botones de filtro */}
        <div className="flex items-center gap-4">
          {OPTIONS.map(({ label, value, icon }) => (
            <div key={value} className="relative group">
              <button
                onClick={() => toggleOption(value)}
                className={`px-4 py-2 rounded-lg transition-all shadow-sm border ${selected.includes(value)
                    ? "bg-[#8b5e3c] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
              >
                <img
                  src={icon}
                  alt={label}
                  className="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:brightness-125"
                />
              </button>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                Filtrar por {label}
              </span>
            </div>
          ))}

          {/* Botón limpiar filtros */}
          <div className="relative group">
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-lg transition-all shadow-sm border ${selected.length === 0 && !search
                  ? "bg-[#8b5e3c] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
            >
              <img
                src="https://img.icons8.com/pulsar-gradient/48/x-coordinate.png"
                alt="Limpiar filtros"
                className="w-7 h-7 transition-transform duration-200 group-hover:scale-110 group-hover:brightness-125"
              />
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-lg">
              {selected.length === 0 && !search ? "Sin filtros activos" : "Limpiar filtros"}
            </span>
          </div>
        </div>

        {/* Ordenar por (alineado a la derecha) */}
        <div className="w-full sm:w-auto sm:ml-auto text-center">

          <select
          className="sm:w-auto px-4 py-2 border rounded-lg bg-white text-gray-800"
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value) {
                params.set("sort", e.target.value);
              } else {
                params.delete("sort");
              }
              router.push(`/?${params.toString()}`);
            }}
            defaultValue={searchParams.get("sort") || ""}
          >
            <option value="">Ordenar por...</option>
            <option value="popularity">Popularidad</option>
            <option value="difficulty">Dificultad</option>
            <option value="prepTime">Tiempo de preparación</option>
          </select>
        </div>
      </div>


      {/* Etiquetas activas */}
      <AnimatePresence>
        {(selected.length > 0 || search) && (
          <motion.div
            className="flex flex-wrap gap-2 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {selected.map((value) => {
              const label = OPTIONS.find((opt) => opt.value === value)?.label ?? value;
              return (
                <motion.div
                  key={value}
                  className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] text-gray-800 rounded-full shadow-sm text-sm hover:bg-gray-200 hover:shadow-md transition duration-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                  <button
                    onClick={() => removeSingleFilter(value)}
                    className="text-gray-500 hover:text-red-500 font-bold focus:outline-none"
                    aria-label={`Quitar filtro ${label}`}
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}

            {search && (
              <motion.div
                key="search"
                className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] text-gray-800 rounded-full shadow-sm text-sm hover:bg-gray-200 hover:shadow-md transition duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                "{search}"
                <button
                  onClick={() => handleSearchChange({ target: { value: "" } } as any)}
                  className="text-gray-500 hover:text-red-500 font-bold focus:outline-none"
                  aria-label="Quitar búsqueda"
                >
                  ×
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};