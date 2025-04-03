export interface Paso {
    title: string;
    description: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
  }
  
  export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: string[];
    instructions: Paso[];
    prepTime: number;
    difficulty: string;
    imageUrl: string;
    creatorId: number;
  }
  