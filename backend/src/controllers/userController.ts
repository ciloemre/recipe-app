import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Request as ExpressRequest } from "express";
import { UserService } from "../services/userService";
import { IUser } from "../models/User";

interface AuthRequest extends ExpressRequest {
  user?: IUser;
}

const userService = new UserService();

const getUserIdOrThrow = (req: AuthRequest): string => {
  const userId = req.user?._id.toString();
  if (!userId) {
    throw new Error("Kullanıcı girişi yapılmamış");
  }
  return userId;
};

export const addToFavorites = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const recipeId = req.params.recipeId;
    const result = await userService.addToFavorites(userId, recipeId);
    res.json({
      message: result.isFavorite
        ? "Tarif favorilere eklendi"
        : "Tarif favorilerden çıkarıldı",
      isFavorite: result.isFavorite,
    });
  }
);

export const getFavorites = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const favorites = await userService.getFavorites(userId);
    res.json(favorites);
  }
);

export const removeFromFavorites = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const recipeId = req.params.recipeId;
    const updatedFavorites = await userService.removeFromFavorites(
      userId,
      recipeId
    );
    res.json(updatedFavorites);
  }
);

export const checkIsFavorite = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const recipeId = req.params.recipeId;
    const isFavorite = await userService.checkIsFavorite(userId, recipeId);
    res.json({ isFavorite });
  }
);

export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  }
);

export const getUserRecipes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const recipes = await userService.getUserRecipes(userId);
    res.json(recipes);
  }
);
