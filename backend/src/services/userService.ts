import User, { IUser } from "../models/User";
import Recipe from "../models/Recipe"; // Recipe modelini import edin
import mongoose from "mongoose";

export class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("-password");
  }

  async addToFavorites(
    userId: string,
    recipeId: string
  ): Promise<{ isFavorite: boolean }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    const favoriteIndex = user.favorites.findIndex((id) =>
      id.equals(recipeObjectId)
    );

    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
      await user.save();
      return { isFavorite: false };
    } else {
      user.favorites.push(recipeObjectId);
      await user.save();
      return { isFavorite: true };
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
}
