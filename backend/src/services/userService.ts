import User, { IUser } from "../models/User";
import Recipe from "../models/Recipe";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { CustomError } from "../utils/customError";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9]).{8,}$/;

export class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("-password");
  }

  async addToFavorites(
    userId: string,
    recipeId: string
  ): Promise<{ isFavorite: boolean; authorId?: string }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    const recipe = await Recipe.findById(recipeId).select("author");
    const authorId = recipe ? String(recipe.author) : undefined;
    const favoriteIndex = user.favorites.findIndex((id) =>
      id.equals(recipeObjectId)
    );

    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
      await user.save();
      return { isFavorite: false, authorId };
    } else {
      user.favorites.push(recipeObjectId);
      await user.save();
      return { isFavorite: true, authorId };
    }
  }

  async getFavorites(userId: string): Promise<mongoose.Types.ObjectId[]> {
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    return user.favorites;
  }

  async removeFromFavorites(
    userId: string,
    recipeId: string
  ): Promise<mongoose.Types.ObjectId[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    user.favorites = user.favorites.filter((id) => !id.equals(recipeObjectId));
    await user.save();
    return user.favorites;
  }

  async checkIsFavorite(userId: string, recipeId: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    return user.favorites.some((favId) => favId.equals(recipeObjectId));
  }

  async getUserRecipes(userId: string) {
    return Recipe.find({ author: userId });
  }

  async updateProfile(
    userId: string,
    data: {
      name: string;
      username: string;
      avatar?: string;
      currentPassword?: string;
      newPassword?: string;
    }
  ): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("Kullanıcı bulunamadı", 404);
    }

    const name = data.name.trim();
    const username = data.username.trim();

    if (name.length < 2) {
      throw new CustomError("İsim en az 2 karakter olmalıdır", 400);
    }

    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new CustomError(
        "Kullanıcı adı en az 3 karakter olmalı ve yalnızca harf, rakam ve alt çizgi içermelidir",
        400
      );
    }

    if (username !== user.username) {
      const taken = await User.findOne({ username, _id: { $ne: user._id } });
      if (taken) {
        throw new CustomError("Bu kullanıcı adı zaten kullanımda", 409);
      }
      user.username = username;
    }

    user.name = name;

    if (typeof data.avatar === "string") {
      const avatar = data.avatar.trim();
      if (!avatar) {
        user.avatar = "";
      } else if (!avatar.startsWith("data:image/") || avatar.length > 400_000) {
        throw new CustomError("Profil fotoğrafı geçersiz veya çok büyük", 400);
      } else {
        user.avatar = avatar;
      }
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new CustomError("Şifre değiştirmek için mevcut şifre gerekli", 400);
      }
      const matches = await user.comparePassword(data.currentPassword);
      if (!matches) {
        throw new CustomError("Mevcut şifre yanlış", 400);
      }
      if (!PASSWORD_REGEX.test(data.newPassword)) {
        throw new CustomError(
          "Yeni şifre en az 8 karakter olmalı ve büyük/küçük harf, rakam ile işaret içermelidir",
          400
        );
      }
      user.password = await bcrypt.hash(data.newPassword, 10);
    }

    try {
      await user.save();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new CustomError("Bu kullanıcı adı zaten kullanımda", 409);
      }
      throw error;
    }

    const updated = await User.findById(userId).select("-password");
    if (!updated) {
      throw new CustomError("Kullanıcı bulunamadı", 404);
    }
    return updated;
  }

  async getFollowStatus(targetId: string, currentUserId?: string) {
    if (!mongoose.isValidObjectId(targetId)) {
      throw new CustomError("Geçersiz kullanıcı", 400);
    }
    const target = await User.findById(targetId).select("followers following");
    if (!target) {
      throw new CustomError("Kullanıcı bulunamadı", 404);
    }
    const followers = target.followers ?? [];
    const following = target.following ?? [];
    return {
      followerCount: followers.length,
      followingCount: following.length,
      isFollowing: currentUserId
        ? followers.some((id) => id.toString() === currentUserId)
        : false,
    };
  }

  async toggleFollow(currentUserId: string, targetId: string) {
    if (!mongoose.isValidObjectId(targetId)) {
      throw new CustomError("Geçersiz kullanıcı", 400);
    }
    if (currentUserId === targetId) {
      throw new CustomError("Kendini takip edemezsin", 400);
    }
    const target = await User.findById(targetId).select("_id");
    const me = await User.findById(currentUserId).select("following");
    if (!target || !me) {
      throw new CustomError("Kullanıcı bulunamadı", 404);
    }

    const already = (me.following ?? []).some((id) => id.toString() === targetId);
    if (already) {
      await User.updateOne({ _id: me._id }, { $pull: { following: target._id } });
      await User.updateOne({ _id: target._id }, { $pull: { followers: me._id } });
    } else {
      await User.updateOne(
        { _id: me._id },
        { $addToSet: { following: target._id } }
      );
      await User.updateOne(
        { _id: target._id },
        { $addToSet: { followers: me._id } }
      );
    }

    const updated = await User.findById(targetId).select("followers");
    return {
      isFollowing: !already,
      followerCount: updated?.followers?.length ?? 0,
    };
  }
}
