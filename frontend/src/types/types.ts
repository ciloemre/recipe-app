export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author: string | { _id: string; username: string };
  image: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ratings: { user: string; value: number }[];
  averageRating: number;
  comments: Comment[];
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
  addedToFavoritesAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
}

export interface Comment {
  _id: string;
  user: string | { _id: string; username: string };
  text: string;
  date: string;
  rating?: number;
}

export interface RecipeFormData {
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
}

export interface ExtendedRecipe extends Recipe {
  difficulty?: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
}
