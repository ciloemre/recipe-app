import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Request as ExpressRequest } from "express";
import { RecipeService } from "../services/recipeService";
import { IUser } from "../models/User";
import { Server } from "socket.io";

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
    const populatedRecipe = await recipe.populate("author", "username");
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
    res.json(recipe);
  } else {
    res.status(404).json({ message: "Tarif veya yorum bulunamadı" });
  }
});

export const rateRecipe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
  }
  const recipe = await recipeService.rateRecipe(
    req.params.id,
    req.user._id.toString(),
    req.body.rating
  );
  if (recipe) {
    const io: Server = req.app.get("io");
    io.emit("recipeRated", {
      recipeId: recipe._id,
      averageRating: recipe.averageRating,
      ratingCount: recipe.ratings.length,
    });
    res.json(recipe);
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
    res.json(result);
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
