import axios from "axios";
import { API_URL } from "../config/api";
import { Recipe, RecipeFormData, User } from "../types/types";
export const TOKEN_KEY = "token";

const PROTECTED_PATH_PREFIXES = [
  "/profile",
  "/favorites",
  "/create",
  "/create-recipe",
  "/recipe-form",
  "/logout",
  "/settings",
];

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
      const hadAuth = Boolean(error.config?.headers?.Authorization);
      if (hadAuth) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event("logout"));

        const path = window.location.pathname;
        const isAuthPage = path === "/login" || path === "/register";
        const isProtected = PROTECTED_PATH_PREFIXES.some((p) =>
          path.startsWith(p)
        );

        // Avoid redirect loops on public browse pages
        if (isProtected && !isAuthPage) {
          sessionStorage.setItem(
            "redirectAfterLogin",
            path + window.location.search
          );
          window.location.href = "/login";
        }
      }
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

export const registerUser = async (userData: {
  username: string;
  name: string;
  email: string;
  password: string;
}): Promise<User & { token: string }> => {
  try {
    const { username, name, email, password } = userData;
    const response = await api.post<User & { token: string }>("/auth/register", {
      username,
      name,
      email,
      password,
    });
    return response.data;
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

export const updateProfile = async (data: {
  name: string;
  username: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<User> => {
  try {
    const response = await api.put<User>("/users/me", data);
    return response.data;
  } catch (error) {
    return handleError(error, "Profil güncellenemedi");
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

export const getFavorites = async (): Promise<
  Array<string | { _id?: string }>
> => {
  try {
    const response = await api.get<Array<string | { _id?: string }>>(
      "/users/favorites"
    );
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
    return handleError(error, "Yorum düzenilirken bir hata oluştu");
  }
};

export const toggleCommentLike = async (
  recipeId: string,
  commentId: string
): Promise<Recipe> => {
  try {
    const response = await api.post<Recipe>(
      `/recipes/${recipeId}/comments/${commentId}/like`
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Yorum beğenilirken bir hata oluştu");
  }
};

export const addCommentReply = async (
  recipeId: string,
  commentId: string,
  text: string,
  replyToUserId?: string,
  replyToReplyId?: string
): Promise<Recipe> => {
  try {
    const response = await api.post<Recipe>(
      `/recipes/${recipeId}/comments/${commentId}/replies`,
      { text, replyToUserId, replyToReplyId }
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Cevap eklenirken bir hata oluştu");
  }
};

export const toggleReplyLike = async (
  recipeId: string,
  commentId: string,
  replyId: string
): Promise<Recipe> => {
  try {
    const response = await api.post<Recipe>(
      `/recipes/${recipeId}/comments/${commentId}/replies/${replyId}/like`
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Cevap beğenilirken bir hata oluştu");
  }
};

export interface AppNotification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  commentId?: string;
  targetId?: string;
  sender: { _id: string; name: string; username: string; avatar?: string } | null;
  recipe: { _id: string; title: string } | null;
}

export interface NotificationList {
  notifications: AppNotification[];
  unreadCount: number;
}

export const getNotifications = async (): Promise<NotificationList> => {
  try {
    const response = await api.get<NotificationList>("/notifications");
    return response.data;
  } catch (error) {
    return handleError(error, "Bildirimler alınamadı");
  }
};

export const markNotificationRead = async (id: string): Promise<void> => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (error) {
    return handleError(error, "Bildirim okunamadı");
  }
};

export const markAllNotificationsRead = async (): Promise<void> => {
  try {
    await api.patch("/notifications/read-all");
  } catch (error) {
    return handleError(error, "Bildirimler okunamadı");
  }
};

export const getFollowStatus = async (
  userId: string
): Promise<{
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}> => {
  try {
    const response = await api.get(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    return handleError(error, "Takip bilgisi alınamadı");
  }
};

export const toggleFollow = async (
  userId: string
): Promise<{ followerCount: number; isFollowing: boolean }> => {
  try {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    return handleError(error, "Takip işlemi tamamlanamadı");
  }
};

export const deleteCommentReply = async (
  recipeId: string,
  commentId: string,
  replyId: string
): Promise<Recipe> => {
  try {
    const response = await api.delete<Recipe>(
      `/recipes/${recipeId}/comments/${commentId}/replies/${replyId}`
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Cevap silinirken bir hata oluştu");
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
    window.location.href = "/home";
  }
};
