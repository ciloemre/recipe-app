import axios from "axios";
import { Recipe, RecipeFormData, User } from "../types/types";

const API_URL = "http://localhost:5003/api";
export const TOKEN_KEY = "token";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register")
    ) {
      return config;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const handleError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data.message || defaultMessage);
    } else if (error.request) {
      throw new Error(
        "Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin."
      );
    } else {
      throw new Error(error.message || defaultMessage);
    }
  }
  throw new Error(defaultMessage);
};

export const registerUser = async (
  userData: Omit<User, "_id"> & { password: string }
): Promise<void> => {
  try {
    await api.post("/auth/register", userData);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Hatası:", error.response.data, error.response.status);
      throw new Error(
        error.response.data.message || "Kayıt sırasında bir hata oluştu"
      );
    }
    throw new Error(
      "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    );
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<string> => {
  try {
    const response = await api.post<{ token: string }>(
      "/auth/login",
      credentials
    );
    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Giriş sırasında bir hata oluştu"
      );
    }
    throw new Error("Giriş sırasında bir hata oluştu");
  }
};

export const getUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/users/me");
    if (!response.data._id) {
      throw new Error("Kullanıcı ID'si bulunamadı");
    }
    return response.data;
  } catch (error) {
    return handleError(error, "Kullanıcı bilgileri alınamadı");
  }
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await api.get<Recipe[]>("/recipes");
    return response.data;
  } catch (error) {
    return handleError(error, "Tarifler yüklenirken bir hata oluştu");
  }
};

export const getUserRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await api.get<Recipe[]>("/users/recipes");
    return response.data;
  } catch (error) {
    return handleError(error, "Kullanıcı tarifleri alınamadı");
  }
};

export const createRecipe = async (
  recipeData: Omit<RecipeFormData, "author"> & {
    authorId: string;
    authorName: string;
  }
): Promise<Recipe> => {
  try {
    const response = await api.post<Recipe>("/recipes", recipeData);
    return response.data;
  } catch (error) {
    return handleError(error, "Tarif oluşturulurken bir hata oluştu");
  }
};

export const updateRecipe = async (
  id: string,
  recipeData: Partial<Recipe>
): Promise<Recipe> => {
  try {
    const response = await api.put<Recipe>(`/recipes/${id}`, recipeData);
    return response.data;
  } catch (error) {
    throw handleError(error, "Tarif güncellenirken bir hata oluştu");
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    await api.delete(`/recipes/${id}`);
  } catch (error) {
    handleError(error, "Tarif silinirken bir hata oluştu");
  }
};

export const getFavorites = async (): Promise<Recipe[]> => {
  try {
    const response = await api.get<Recipe[]>("/users/favorites");
    return response.data;
  } catch (error) {
    return handleError(error, "Favoriler yüklenirken bir hata oluştu");
  }
};

export const toggleFavorite = async (
  recipeId: string
): Promise<{ isFavorite: boolean }> => {
  try {
    const response = await api.post<{ isFavorite: boolean }>(
      `/users/favorites/${recipeId}`
    );
    console.log("Toggle favorite response:", response.data);
    return response.data;
  } catch (error) {
    return handleError(error, "Favori durumu değiştirilirken bir hata oluştu");
  }
};

export const checkIsFavorite = async (recipeId: string): Promise<boolean> => {
  try {
    const response = await api.get(`/users/favorites/check/${recipeId}`);
    return response.data.isFavorite;
  } catch (error) {
    return handleError(
      error,
      "Favori durumu kontrol edilirken bir hata oluştu"
    );
  }
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  try {
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, "Tarif yüklenirken bir hata oluştu");
  }
};

export const rateRecipe = async (
  recipeId: string,
  rating: number
): Promise<Recipe> => {
  try {
    const response = await api.post<Recipe>(`/recipes/${recipeId}/rate`, {
      rating,
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Derecelendirme sırasında bir hata oluştu");
  }
};

export const addComment = async (
  recipeId: string,
  text: string
): Promise<Recipe> => {
  try {
    const response = await api.post<Recipe>(`/recipes/${recipeId}/comments`, {
      text,
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Yorum eklenirken bir hata oluştu");
  }
};

export const deleteComment = async (
  recipeId: string,
  commentId: string
): Promise<Recipe> => {
  try {
    const response = await api.delete<Recipe>(
      `/recipes/${recipeId}/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Yorum silinirken bir hata oluştu");
  }
};

export const editComment = async (
  recipeId: string,
  commentId: string,
  text: string
): Promise<Recipe> => {
  try {
    const response = await api.put<Recipe>(
      `/recipes/${recipeId}/comments/${commentId}`,
      { text }
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Yorum düzenlenirken bir hata oluştu");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await api.post("/auth/logout", { token });
    }
  } catch (error) {
    console.error("Çıkış yapılırken bir hata oluştu:", error);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("logout"));
    window.location.href = "/login";
  }
};
