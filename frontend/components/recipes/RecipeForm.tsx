import { useState } from "react";
import { RecetaFormData, PasoInstruccion } from "@/types/receta";
import { BurgerLoadingAnimation } from "@/components/views/loading/BurgerLoadingAnimation";

interface RecipeFormProps {
    onSubmit: (formData: RecetaFormData) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const RecipeForm = ({ onSubmit, loading, error }: RecipeFormProps) => {
    const [formData, setFormData] = useState<RecetaFormData>({
        title: "",
        description: "",
        ingredients: [""],
        instructions: [{ title: "", description: "" }],
        prepTime: 0,
        difficulty: 1,
        imageUrl: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    const handleInstructionChange = (index: number, field: keyof PasoInstruccion, value: string) => {
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl text-center font-bold mb-6">Subir mi propia receta</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                required
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
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Dificultad (1-5)</label>
                                <input
                                    type="number"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="flex-grow w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="5"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">URL de la imagen</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
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
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 200g de pasta"
                                required
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
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => handleInstructionChange(index, "description", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>

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
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Añadir paso
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 ${loading ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
                            } text-white rounded-lg font-medium flex flex-col items-center`}
                    >
                        {loading ? (
                            <>
                                Creando receta...
                            </>
                        ) : (
                            'Publicar receta'
                        )}
                    </button>
                        {loading && <BurgerLoadingAnimation />}
                </div>
            </form>
        </div>
    );
};