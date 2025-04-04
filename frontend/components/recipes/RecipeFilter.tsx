"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

    return (
        <div className="w-full max-w-6xl mb-6 flex flex-row">
            <div className="flex items-center gap-4">
                {OPTIONS.map(({ label, value, icon }) => (
                    <div className="relative group">
                        <button
                            key={value}
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

                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                            Filtrar por {label}
                        </span>
                    </div>
                ))}

                {/* Botón para limpiar filtros */}
                <div className="relative group">
                    <button
                        onClick={clearFilters}
                        className={`px-4 py-2 rounded-lg transition-all shadow-sm border ${selected.length === 0
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

                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                        {selected.length === 0 ? "Sin filtros activos" : "Limpiar filtros"}
                    </span>
                </div>
            </div>
        </div>
    );
};
