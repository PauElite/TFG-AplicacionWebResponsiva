import { useState } from "react";
import type { RecetaFormData } from "@/types/receta"
import type { Step } from "../../../shared/models/recipe";
import { useEffect } from "react";
import { getImageSrc } from "@/utils/mediaUtils";
import { BurgerLoadingAnimation } from "@/components/views/loading/BurgerLoadingAnimation";
import { Toast } from "@/components/ui/Toast";

interface RecipeFormProps {
    onSubmit: (formData: RecetaFormData) => Promise<void>;
    loading: boolean;
    error: string | null;
    initialData?: RecetaFormData;
}

export const RecipeForm = ({ onSubmit, loading, error, initialData }: RecipeFormProps) => {
    const [formData, setFormData] = useState<RecetaFormData>(
        initialData || {
            title: "",
            description: "",
            ingredients: [""],
            instructions: [{ title: "", description: "" }],
            prepTime: 0,
            suitableFor: [],
            difficulty: "1",
            imageUrl: ""
        }
    );
    const [toastMessage, setToastMessage] = useState<string>("");

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorMsg = validarReceta(formData);
        if (errorMsg) {
            setToastMessage(errorMsg);
            return;
        }
        await onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addIngredient = () => {
        setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
    };

    const removeIngredient = (index: number) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const handleInstructionChange = (index: number, field: keyof Step, value: string) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index] = { ...newInstructions[index], [field]: value };
        setFormData(prev => ({ ...prev, instructions: newInstructions }));
    };

    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...prev.instructions, { title: "", description: "" }]
        }));
    };

    const removeInstruction = (index: number) => {
        const newInstructions = formData.instructions.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, instructions: newInstructions }));
    };

    const validarReceta = (formData: RecetaFormData): string | null => {
        if (!formData.title.trim()) {
            return "El título es obligatorio.";
        }

        if (!formData.description.trim()) {
            return "La descripción es obligatoria.";
        }

        if (formData.prepTime <= 0) {
            return "El tiempo de preparación no puede ser negativo o cero.";
        }

        const dificultad = Number(formData.difficulty);
        if (isNaN(dificultad) || dificultad < 1 || dificultad > 5) {
            return "La dificultad debe estar entre 1 y 5.";
        }

        if (!formData.ingredients.length || formData.ingredients.some(i => !i.trim())) {
            return "Todos los ingredientes deben estar completos.";
        }

        if (
            !formData.instructions.length ||
            formData.instructions.some(step => !step.title.trim() || !step.description.trim())
        ) {
            return "Todos los pasos deben tener título y descripción.";
        }

        return null; // Todo OK
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl text-center font-bold mb-6">Subir mi propia receta</h1>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Sección básica */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Información básica</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Título de la receta</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Tiempo de preparación (minutos)</label>
                                <input
                                    type="number"
                                    name="prepTime"
                                    value={formData.prepTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Dificultad (1-5)</label>
                                <input
                                    type="number"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="flex-grow w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                                    min="1"
                                    max="5"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">¿Para qué dispositivos es apta?</label>
                                <div className="flex flex-col gap-2">
                                    <label className="inline-flex items-center gap-2 group cursor-pointer p-2 rounded-md transition-shadow duration-200 hover:shadow-md hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={formData.suitableFor?.includes("airfrier") || false}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    suitableFor: checked
                                                        ? [...(prev.suitableFor || []), "airfrier"]
                                                        : (prev.suitableFor || []).filter((val) => val !== "airfrier"),
                                                }));
                                            }}
                                        />
                                        <img width="32" height="32" src="https://img.icons8.com/external-filled-line-andi-nur-abdillah/64/external-Air-Fryer-home-appliances-(filled-line)-filled-line-andi-nur-abdillah.png"
                                            alt="external-Air-Fryer-home-appliances-(filled-line)-filled-line-andi-nur-abdillah"
                                            className="w-8 h-8 transition-transform duration-200 group-hover:scale-110 group-hover:brightness-125" />
                                        <span>AirFrier</span>
                                    </label>

                                    <label className="inline-flex items-center gap-2 group cursor-pointer p-2 rounded-md transition-shadow duration-200 hover:shadow-md hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={formData.suitableFor?.includes("horno") || false}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    suitableFor: checked
                                                        ? [...(prev.suitableFor || []), "horno"]
                                                        : (prev.suitableFor || []).filter((val) => val !== "horno"),
                                                }));
                                            }}
                                        />
                                        <img width="32" height="32" src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/external-oven-kitchen-kiranshastry-lineal-color-kiranshastry.png"
                                            alt="external-oven-kitchen-kiranshastry-lineal-color-kiranshastry"
                                            className="w-8 h-8 transition-transform duration-200 group-hover:scale-110 group-hover:brightness-125" />
                                        <span>Horno</span>
                                    </label>
                                </div>
                            </div>

                        </div>

                        {initialData ? (
                            <div>
                                <label className="block text-gray-700 mb-2">Imagen principal</label>
                                <img
                                    src={getImageSrc(formData.imageUrl)}
                                    alt="Imagen de la receta"
                                    className="max-w-xs rounded-lg shadow-md"
                                />
                                <p className="text-sm text-gray-500 mt-1">No se puede modificar al editar.</p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-gray-700 mb-2">URL de la imagen</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Imagen desde tu ordenador</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    imageFile: e.target.files![0],
                                                    imageUrl: "" // vacía la URL si sube archivo
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        )}

                    </div>
                </div>

                {/* Ingredientes */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Ingredientes</h2>

                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                                placeholder="Ej: 200g de pasta"
                            />
                            {formData.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addIngredient}
                        className="mt-2 px-4 py-2 bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white rounded-lg "
                    >
                        Añadir ingrediente
                    </button>
                </div>

                {/* Instrucciones */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>

                    {formData.instructions.map((step, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                            <div className="mb-2">
                                <label className="block text-gray-700 mb-1">Título del paso {index + 1}</label>
                                <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => handleInstructionChange(index, "title", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Paso ${index + 1}: ...`}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => handleInstructionChange(index, "description", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                            {initialData ? (
                                step.mediaUrl && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Media asociado:</p>
                                        {step.mediaType === "image" ? (
                                            <img
                                                src={getImageSrc(step.mediaUrl)}
                                                alt={`Paso ${index + 1}`}
                                                className="w-full max-w-xs rounded-lg mt-1"
                                            />
                                        ) : (
                                            <video
                                                controls
                                                src={step.mediaUrl}
                                                className="w-full max-w-xs rounded-lg mt-1"
                                            />
                                        )}
                                    </div>
                                )
                            ) : (
                                <>
                                    {/* Campo para URL de vídeo */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 mb-1">Vídeo (URL de YouTube, Vimeo, etc.)</label>
                                        <input
                                            type="url"
                                            value={step.mediaUrl || ""}
                                            onChange={(e) => {
                                                handleInstructionChange(index, "mediaUrl", e.target.value);
                                                if (step.mediaType !== "video") {
                                                    handleInstructionChange(index, "mediaType", "video");
                                                }
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>

                                    {/* Campo para subir imagen local */}
                                    <div className="mb-2">
                                        <label className="block text-gray-700 mb-1">Imagen (archivo local)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                setFormData(prev => {
                                                    const newInstructions = [...prev.instructions];
                                                    newInstructions[index].file = file;
                                                    newInstructions[index].mediaType = "image";
                                                    newInstructions[index].mediaUrl = ""; // limpiamos si se sube imagen
                                                    return { ...prev, instructions: newInstructions };
                                                });
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {formData.instructions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeInstruction(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Eliminar paso
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addInstruction}
                        className="mt-2 px-4 py-2 bg-[#8b5e3c] hover:bg-[#a66b47c4] text-white rounded-lg "
                    >
                        Añadir paso
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 ${loading ? 'bg-[#795234]' : 'bg-[#8b5e3c] hover:bg-[#a66b47c4]'
                            } text-white rounded-lg font-medium flex flex-col items-center`}
                    >
                        {loading ? (
                            <>
                                {initialData ? "Actualizando receta..." : "Creando receta..."}
                            </>
                        ) : (
                            initialData ? "Actualizar receta" : "Publicar receta"
                        )}
                    </button>
                    {loading && <BurgerLoadingAnimation />}
                </div>
            </form>
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};