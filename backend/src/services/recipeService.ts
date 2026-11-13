import Recipe, { IRecipe, IAuthor, IComment } from "../models/Recipe";
import mongoose from "mongoose";

export class RecipeService {
  async getAllRecipes(): Promise<IRecipe[]> {
    return Recipe.find().populate("author", "username name avatar").sort({ createdAt: -1 });
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
    return recipe.populate("author", "username name avatar");
  }

  async getRecipeById(id: string): Promise<IRecipe | null> {
    return Recipe.findById(id)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
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
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
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
      likes: [],
      replies: [],
    };
    recipe.comments.push(comment);
    await recipe.save();

    return Recipe.findById(recipeId)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
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
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
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
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
  }

  async toggleCommentLike(
    recipeId: string,
    commentId: string,
    userId: string
  ): Promise<{ recipe: IRecipe; liked: boolean; targetUserId: string; targetText: string } | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return null;
    }
    const likes = comment.likes ?? [];
    const existing = likes.findIndex((id) => id.toString() === userId);
    const liked = existing === -1;
    if (existing > -1) {
      likes.splice(existing, 1);
    } else {
      likes.push(new mongoose.Types.ObjectId(userId));
    }
    comment.likes = likes;
    const targetUserId = comment.user.toString();
    const targetText = comment.text;
    await recipe.save();

    const populated = await Recipe.findById(recipeId)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
    if (!populated) return null;
    return { recipe: populated, liked, targetUserId, targetText };
  }

  async addCommentReply(
    recipeId: string,
    commentId: string,
    userId: string,
    text: string,
    replyToUserId?: string,
    replyToReplyId?: string
  ): Promise<{
    recipe: IRecipe;
    targetUserId: string;
    replyText: string;
    replyId: string;
    parentText: string;
    direct: boolean;
  } | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return null;
    }
    if (!comment.replies) {
      comment.replies = [];
    }
    const commentAuthorId = comment.user.toString();
    const participantIds = new Set<string>([
      commentAuthorId,
      ...(comment.replies ?? []).map((item) => item.user.toString()),
    ]);
    const direct =
      Boolean(replyToUserId) &&
      replyToUserId !== commentAuthorId &&
      participantIds.has(replyToUserId as string);
    const targetUserId = direct ? (replyToUserId as string) : commentAuthorId;
    const answeredReply = replyToReplyId
      ? (comment.replies ?? []).find((item) => item._id?.toString() === replyToReplyId)
      : direct
        ? [...(comment.replies ?? [])]
            .reverse()
            .find((item) => item.user.toString() === replyToUserId)
        : undefined;
    const parentText = answeredReply?.text || comment.text;
    comment.replies!.push({
      user: new mongoose.Types.ObjectId(userId),
      text,
      date: new Date(),
      likes: [],
      ...(direct ? { replyTo: new mongoose.Types.ObjectId(replyToUserId) } : {}),
    });
    const createdReply = comment.replies![comment.replies!.length - 1];
    await recipe.save();

    const populated = await Recipe.findById(recipeId)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
    if (!populated) return null;
    return {
      recipe: populated,
      targetUserId,
      replyText: text,
      replyId: String(createdReply._id),
      parentText,
      direct,
    };
  }

  async toggleReplyLike(
    recipeId: string,
    commentId: string,
    replyId: string,
    userId: string
  ): Promise<{ recipe: IRecipe; liked: boolean; targetUserId: string; targetText: string } | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const comment = recipe.comments.id(commentId);
    const reply = comment?.replies?.find((item) => item._id?.toString() === replyId);
    if (!comment || !reply) {
      return null;
    }
    const likes = reply.likes ?? [];
    const existing = likes.findIndex((id) => id.toString() === userId);
    const liked = existing === -1;
    if (existing > -1) {
      likes.splice(existing, 1);
    } else {
      likes.push(new mongoose.Types.ObjectId(userId));
    }
    reply.likes = likes;
    const targetUserId = reply.user.toString();
    const targetText = reply.text;
    await recipe.save();

    const populated = await Recipe.findById(recipeId)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
    if (!populated) return null;
    return { recipe: populated, liked, targetUserId, targetText };
  }

  async deleteCommentReply(
    recipeId: string,
    commentId: string,
    replyId: string,
    userId: string
  ): Promise<IRecipe | null> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return null;
    }
    const comment = recipe.comments.id(commentId);
    if (!comment || !comment.replies) {
      return null;
    }
    const replyIndex = comment.replies.findIndex(
      (reply) =>
        reply._id &&
        reply._id.toString() === replyId &&
        reply.user.toString() === userId
    );
    if (replyIndex === -1) {
      throw new Error("Cevap bulunamadı veya silme yetkiniz yok");
    }
    comment.replies.splice(replyIndex, 1);
    await recipe.save();

    return Recipe.findById(recipeId)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
  }

  async rateRecipe(
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<{ recipe: IRecipe; authorId: string; rating: number } | null> {
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
    const authorId = recipe.author.toString();
    await recipe.save();

    const populated = await Recipe.findById(recipeId)
      .populate("author", "username name avatar")
      .populate("comments.user", "username name avatar")
      .populate("comments.replies.user", "username name avatar")
      .populate("comments.replies.replyTo", "username name avatar");
    if (!populated) return null;
    return { recipe: populated, authorId, rating };
  }

  async toggleFavorite(
    recipeId: string,
    userId: string
  ): Promise<{ isFavorite: boolean; authorId: string }> {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error("Tarif bulunamadı");
    }
    const authorId = recipe.author.toString();
    const favoriteIndex = recipe.favorites.indexOf(
      new mongoose.Types.ObjectId(userId)
    );
    if (favoriteIndex > -1) {
      recipe.favorites.splice(favoriteIndex, 1);
    } else {
      recipe.favorites.push(new mongoose.Types.ObjectId(userId));
    }
    await recipe.save();
    return { isFavorite: favoriteIndex === -1, authorId };
  }

  async getFavorites(userId: string): Promise<IRecipe[]> {
    const favorites = await Recipe.find({
      favorites: new mongoose.Types.ObjectId(userId),
    })
      .populate<{ author: IAuthor }>("author", "username name avatar")
      .lean();

    return favorites.map((recipe) => ({
      ...recipe,
      author: {
        _id: recipe.author._id.toString(),
        username: (recipe.author as IAuthor).username || "",
        name: (recipe.author as IAuthor).name || "",
      },
    })) as IRecipe[];
  }
}
