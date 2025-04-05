export interface Step {
    title: string;
    description: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    file?: File | null;
  }
  
  export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: string[];
    instructions: Step[];
    prepTime: number;
    suitableFor?: ("airfrier" | "horno")[];
    difficulty: string;
    imageUrl?: string;
    creatorId: number;
    popularity: number;
    imageFile?: File;
  }
  