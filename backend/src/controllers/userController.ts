import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Request as ExpressRequest } from "express";
import { UserService } from "../services/userService";
import { IUser } from "../models/User";
import { CustomError } from "../utils/customError";
import { Server } from "socket.io";
import { createAndEmitNotification } from "../services/notificationService";

interface AuthRequest extends ExpressRequest {
  user?: IUser;
}

const userService = new UserService();

function presentUser(user: IUser) {
  const raw = user.toObject();
  const followerCount = Array.isArray(raw.followers) ? raw.followers.length : 0;
  const followingCount = Array.isArray(raw.following) ? raw.following.length : 0;
  delete raw.followers;
  delete raw.following;
  delete raw.password;
  return { ...raw, followerCount, followingCount };
}

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
    if (result.isFavorite && result.authorId) {
      const io = req.app.get("io") as Server;
      await createAndEmitNotification({
        io,
        recipientId: result.authorId,
        senderId: userId,
        type: "RECIPE_FAVORITE",
        recipeId,
        message: "tarifini favorilerine ekledi",
      });
    }
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
    res.json(presentUser(user));
  }
);

export const getFollowStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const status = await userService.getFollowStatus(
        req.params.id,
        req.user?._id?.toString()
      );
      res.json(status);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      throw error;
    }
  }
);

export const toggleFollow = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    try {
      const result = await userService.toggleFollow(userId, req.params.id);
      if (result.isFollowing) {
        const io = req.app.get("io") as Server;
        await createAndEmitNotification({
          io,
          recipientId: req.params.id,
          senderId: userId,
          type: "USER_FOLLOW",
          message: "seni takip etmeye başladı",
        });
        io.to(`user_${req.params.id}`).emit("follow:updated", {
          followerCount: result.followerCount,
        });
      } else {
        const io = req.app.get("io") as Server;
        io.to(`user_${req.params.id}`).emit("follow:updated", {
          followerCount: result.followerCount,
        });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      throw error;
    }
  }
);

export const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const { name, username, avatar, currentPassword, newPassword } = req.body;

    if (typeof name !== "string" || typeof username !== "string") {
      return res.status(400).json({ message: "İsim ve kullanıcı adı zorunludur" });
    }

    try {
      const user = await userService.updateProfile(userId, {
        name,
        username,
        avatar: typeof avatar === "string" ? avatar : undefined,
        currentPassword:
          typeof currentPassword === "string" ? currentPassword : undefined,
        newPassword: typeof newPassword === "string" ? newPassword : undefined,
      });
      const io = req.app.get("io") as Server;
      io.emit("userUpdated", {
        _id: String(user._id),
        name: user.name,
        username: user.username,
        avatar: user.avatar || "",
      });
      res.json(presentUser(user));
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      throw error;
    }
  }
);

export const getUserRecipes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = getUserIdOrThrow(req);
    const recipes = await userService.getUserRecipes(userId);
    res.json(recipes);
  }
);
