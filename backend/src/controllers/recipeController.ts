import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Request as ExpressRequest } from "express";
import { RecipeService } from "../services/recipeService";
import { IUser } from "../models/User";
import { Server } from "socket.io";
import { createAndEmitNotification } from "../services/notificationService";

function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function publishRecipe(io: Server, recipe: { toObject?: () => object }) {
  const payload = typeof recipe.toObject === "function" ? recipe.toObject() : recipe;
  io.emit("commentUpdated", payload);
}

function refId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

interface Request extends ExpressRequest {
  user?: IUser;
}

const recipeService = new RecipeService();

export const getAllRecipes = asyncHandler(
  async (req: Request, res: Response) => {
    const recipes = await recipeService.getAllRecipes();
    res.json(recipes);
  }
);

export const createRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const recipeData = {
      ...req.body,
      author: req.user._id,
    };
    const recipe = await recipeService.createRecipe(
      recipeData,
      req.user._id.toString()
    );

    const io = req.app.get("io");
    const populatedRecipe = await recipe.populate("author", "username name avatar");
    console.log("Emitting new recipe:", populatedRecipe);
    io.emit("recipeAdded", populatedRecipe);

    res.status(201).json(populatedRecipe);
  }
);

export const getRecipeById = asyncHandler(
  async (req: Request, res: Response) => {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: "Tarif bulunamadı" });
    }
  }
);

export const updateRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const updatedRecipe = await recipeService.updateRecipe(
      req.params.id,
      req.body,
      req.user._id.toString()
    );
    if (updatedRecipe) {
      const io: Server = req.app.get("io");
      io.emit("recipeUpdated", updatedRecipe);
      console.log("Emitting updated recipe:", updatedRecipe);
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: "Tarif bulunamadı" });
    }
  }
);
export const deleteRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const isDeleted = await recipeService.deleteRecipe(
      req.params.id,
      req.user._id.toString()
    );
    if (isDeleted) {
      const io: Server = req.app.get("io");
      io.emit("recipeDeleted", req.params.id);
      console.log("Emitting deleted recipe ID:", req.params.id);
      res.json({ message: "Tarif silindi" });
    } else {
      res.status(404).json({ message: "Tarif bulunamadı" });
    }
  }
);

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
  }
  const recipe = await recipeService.addComment(
    req.params.id,
    req.user._id.toString(),
    req.body.text
  );
  if (recipe) {
    const io: Server = req.app.get("io");
    io.emit("commentAdded", {
      recipeId: recipe._id,
      commentCount: recipe.comments.length,
    });
    publishRecipe(io, recipe);
    const created = recipe.comments[recipe.comments.length - 1];
    await createAndEmitNotification({
      io,
      recipientId: refId(recipe.author),
      senderId: req.user._id.toString(),
      type: "RECIPE_COMMENT",
      recipeId: String(recipe._id),
      commentId: created?._id ? String(created._id) : undefined,
      message: `tarifine yorum bıraktı: “${clip(created?.text || req.body.text || "", 45)}”`,
    });
    res.status(201).json(recipe);
  } else {
    res.status(404).json({ message: "Tarif bulunamadı" });
  }
});

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const recipe = await recipeService.deleteComment(
      req.params.id,
      req.params.commentId,
      req.user._id.toString()
    );
    if (recipe) {
      const io: Server = req.app.get("io");
      io.emit("commentDeleted", {
        recipeId: recipe._id,
        commentCount: recipe.comments.length,
      });
      publishRecipe(io, recipe);
      res.json(recipe);
    } else {
      res.status(404).json({ message: "Tarif bulunamadı" });
    }
  }
);
export const editComment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
  }
  const recipe = await recipeService.editComment(
    req.params.id,
    req.params.commentId,
    req.user._id.toString(),
    req.body.text
  );
  if (recipe) {
    const io: Server = req.app.get("io");
    const updatedComment = recipe.comments.find(
      (c) => c._id?.toString() === req.params.commentId
    );
    if (updatedComment) {
      io.emit("commentEdited", {
        recipeId: recipe._id,
        comment: updatedComment,
      });
    }
    publishRecipe(io, recipe);
    res.json(recipe);
  } else {
    res.status(404).json({ message: "Tarif veya yorum bulunamadı" });
  }
});

export const toggleCommentLike = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const result = await recipeService.toggleCommentLike(
      req.params.id,
      req.params.commentId,
      req.user._id.toString()
    );
    if (!result) {
      return res.status(404).json({ message: "Tarif veya yorum bulunamadı" });
    }
    const io: Server = req.app.get("io");
    publishRecipe(io, result.recipe);
    if (result.liked) {
      await createAndEmitNotification({
        io,
        recipientId: result.targetUserId,
        senderId: req.user._id.toString(),
        type: "COMMENT_LIKE",
        recipeId: String(result.recipe._id),
        commentId: req.params.commentId,
        message: `"${clip(result.targetText, 45)}" yorumunu beğendi`,
      });
    }
    res.json(result.recipe);
  }
);

export const addCommentReply = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    if (!text) {
      return res.status(400).json({ message: "Cevap metni boş olamaz" });
    }
    const replyToUserId =
      typeof req.body.replyToUserId === "string" ? req.body.replyToUserId : undefined;
    const replyToReplyId =
      typeof req.body.replyToReplyId === "string" ? req.body.replyToReplyId : undefined;
    const result = await recipeService.addCommentReply(
      req.params.id,
      req.params.commentId,
      req.user._id.toString(),
      text,
      replyToUserId,
      replyToReplyId
    );
    if (!result) {
      return res.status(404).json({ message: "Tarif veya yorum bulunamadı" });
    }
    const io: Server = req.app.get("io");
    publishRecipe(io, result.recipe);
    await createAndEmitNotification({
      io,
      recipientId: result.targetUserId,
      senderId: req.user._id.toString(),
      type: "COMMENT_REPLY",
      recipeId: String(result.recipe._id),
      commentId: req.params.commentId,
      targetId: result.replyId,
      message: `"${clip(result.parentText, 35)}" yorumuna yanıt verdi: "${clip(result.replyText, 45)}"`,
    });
    res.status(201).json(result.recipe);
  }
);

export const toggleReplyLike = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const result = await recipeService.toggleReplyLike(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.user._id.toString()
    );
    if (!result) {
      return res.status(404).json({ message: "Tarif veya cevap bulunamadı" });
    }
    const io: Server = req.app.get("io");
    publishRecipe(io, result.recipe);
    if (result.liked) {
      await createAndEmitNotification({
        io,
        recipientId: result.targetUserId,
        senderId: req.user._id.toString(),
        type: "REPLY_LIKE",
        recipeId: String(result.recipe._id),
        commentId: req.params.commentId,
        targetId: req.params.replyId,
        message: `"${clip(result.targetText, 45)}" yorumunu beğendi`,
      });
    }
    res.json(result.recipe);
  }
);

export const deleteCommentReply = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const recipe = await recipeService.deleteCommentReply(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.user._id.toString()
    );
    if (!recipe) {
      return res.status(404).json({ message: "Tarif veya yorum bulunamadı" });
    }
    const io: Server = req.app.get("io");
    publishRecipe(io, recipe);
    res.json(recipe);
  }
);

export const rateRecipe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
  }
  const result = await recipeService.rateRecipe(
    req.params.id,
    req.user._id.toString(),
    req.body.rating
  );
  if (result) {
    const io: Server = req.app.get("io");
    io.emit("recipeRated", {
      recipeId: result.recipe._id,
      averageRating: result.recipe.averageRating,
      ratingCount: result.recipe.ratings.length,
    });
    await createAndEmitNotification({
      io,
      recipientId: result.authorId,
      senderId: req.user._id.toString(),
      type: "RECIPE_RATING",
      recipeId: String(result.recipe._id),
      message: `tarifine ${result.rating} yıldız verdi`,
    });
    res.json(result.recipe);
  } else {
    res.status(404).json({ message: "Tarif bulunamadı" });
  }
});

export const toggleFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const result = await recipeService.toggleFavorite(
      req.params.id,
      req.user._id.toString()
    );
    if (result.isFavorite) {
      const io: Server = req.app.get("io");
      await createAndEmitNotification({
        io,
        recipientId: result.authorId,
        senderId: req.user._id.toString(),
        type: "RECIPE_FAVORITE",
        recipeId: req.params.id,
        message: "tarifini favorilerine ekledi",
      });
    }
    res.json({ isFavorite: result.isFavorite });
  }
);

export const getFavorites = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const favorites = await recipeService.getFavorites(req.user._id.toString());
    res.json(favorites);
  }
);
