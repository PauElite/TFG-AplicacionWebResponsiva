export type PasoInstruccion = {
    title: string;
    description: string;
  };
  
  export type RecetaFormData = {
    title: string;
    description: string;
    ingredients: string[];
    instructions: PasoInstruccion[];
    prepTime: number;
    difficulty: number;
    imageUrl: string;
  };