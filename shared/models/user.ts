export interface User {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
    avatar: string;
    bio: string;
    recipeIds: number[];
  }
  