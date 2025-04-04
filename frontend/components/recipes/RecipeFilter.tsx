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

  useEffect(() => {
    const values = searchParams.getAll("suitableFor");
    setSelected(values);
  }, [searchParams]);

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    const params = new URLSearchParams();
    newSelected.forEach((val) => params.append("suitableFor", val));

    const url = newSelected.length > 0 ? `/?${params.toString()}` : "/";
    router.push(url);
  };

  const clearFilters = () => {
    setSelected([]);
    router.push("/");
  };

  const removeSingleFilter = (value: string) => {
    const newSelected = selected.filter((v) => v !== value);
    const params = new URLSearchParams();
    newSelected.forEach((val) => params.append("suitableFor", val));
    const url = newSelected.length > 0 ? `/?${params.toString()}` : "/";
    router.push(url);
  };

  return (
    <div className="w-full max-w-6xl mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {OPTIONS.map(({ label, value, icon }) => (
          <div key={value} className="relative group">
            <button
              onClick={() => toggleOption(value)}
              className={`px-4 py-2 rounded-lg transition-all shadow-sm border ${
                selected.includes(value)
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

        <div className="relative group">
          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-lg transition-all shadow-sm border ${
              selected.length === 0
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
            {selected.length === 0 ? "Sin filtros activos" : "Limpiar filtros"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {selected.length > 0 && (
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
                  className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] text-gray-800 rounded-full shadow-sm text-sm"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};