import Recipe, { IRecipe, IAuthor, IComment } from "../models/Recipe";
import mongoose from "mongoose";

export class RecipeService {
  async getAllRecipes(): Promise<IRecipe[]> {
    return Recipe.find().populate("author", "username").sort({ createdAt: -1 });
  }

  async createRecipe(
    recipeData: Partial<IRecipe>,
    authorId: string
  ): Promise<IRecipe> {
    const recipe = new Recipe({
      ...recipeData,
      author: new mongoose.Types.ObjectId(authorId),
    });
    await recipe.save();
    return recipe.populate("author", "username");
  }

  async getRecipeById(id: string): Promise<IRecipe | null> {
    return Recipe.findById(id)
      .populate("author", "username")
      .populate("comments.user", "username");
  }

  async updateRecipe(
    id: string,
    recipeData: Partial<IRecipe>,
    userId: string
  ): Promise<IRecipe | null> {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return null;
    }
    if (recipe.author.toString() !== userId) {
      throw new Error("Bu tarifi düzenleme yetkiniz yok");
    }
    Object.assign(recipe, recipeData);
    await recipe.save();

    return Recipe.findById(id)
      .populate("author", "username")
      .populate("comments.user", "username");
  }

  async deleteRecipe(id: string, userId: string): Promise<boolean> {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return false;
    }
    if (recipe.author.toString() !== userId) {
      throw new Error("Bu tarifi silme yetkiniz yok");
    }
    await Recipe.deleteOne({ _id: recipe._id });
    return true;
  }

  async addComment(
    recipeId: string,
    userId: string,
    text: string
  ): Promise<IRecipe | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const comment: IComment = {
      user: new mongoose.Types.ObjectId(userId),
      text,
      date: new Date(),
    };
    recipe.comments.push(comment);
    await recipe.save();

    return Recipe.findById(recipeId)
      .populate("author", "username")
      .populate("comments.user", "username");
  }

  async deleteComment(
    recipeId: string,
    commentId: string,
    userId: string
  ): Promise<IRecipe | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const commentIndex = recipe.comments.findIndex(
      (comment) =>
        comment._id &&
        comment._id.toString() === commentId &&
        comment.user.toString() === userId
    );
    if (commentIndex === -1) {
      throw new Error("Yorum bulunamadı veya silme yetkiniz yok");
    }
    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

    return Recipe.findById(recipeId)
      .populate("author", "username")
      .populate("comments.user", "username");
  }

  async editComment(
    recipeId: string,
    commentId: string,
    userId: string,
    text: string
  ): Promise<IRecipe | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return null;
    }
    if (comment.user.toString() !== userId) {
      throw new Error("Bu yorumu düzenleme yetkiniz yok");
    }
    comment.text = text;
    await recipe.save();

    return Recipe.findById(recipeId)
      .populate("author", "username")
      .populate("comments.user", "username");
  }

  async rateRecipe(
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<IRecipe | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const ratingIndex = recipe.ratings.findIndex(
      (r) => r.user.toString() === userId
    );
    if (ratingIndex > -1) {
      recipe.ratings[ratingIndex].value = rating;
    } else {
      recipe.ratings.push({
        user: new mongoose.Types.ObjectId(userId),
        value: rating,
      });
    }
    recipe.averageRating = recipe.calculateAverageRating();
    await recipe.save();

    return Recipe.findById(recipeId)
      .populate("author", "username")
      .populate("comments.user", "username");
  }

  async toggleFavorite(
    recipeId: string,
    userId: string
  ): Promise<{ isFavorite: boolean }> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error("Tarif bulunamadı");
    }
    const favoriteIndex = recipe.favorites.indexOf(
      new mongoose.Types.ObjectId(userId)
    );
    if (favoriteIndex > -1) {
      recipe.favorites.splice(favoriteIndex, 1);
    } else {
      recipe.favorites.push(new mongoose.Types.ObjectId(userId));
    }
    await recipe.save();
    return { isFavorite: favoriteIndex === -1 };
  }

  async getFavorites(userId: string): Promise<IRecipe[]> {
    const favorites = await Recipe.find({
      favorites: new mongoose.Types.ObjectId(userId),
    })
      .populate<{ author: IAuthor }>("author", "username")
      .lean();

    return favorites.map((recipe) => ({
      ...recipe,
      author: {
        _id: recipe.author._id.toString(),
        username: (recipe.author as IAuthor).username || "Bilinmeyen Kullanıcı",
      },
    })) as IRecipe[];
  }
}
