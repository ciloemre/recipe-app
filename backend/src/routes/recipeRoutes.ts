import express from "express";
import {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addComment,
  rateRecipe,
  deleteComment,
  toggleFavorite,
  getFavorites,
  editComment,
} from "../controllers/recipeController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(getAllRecipes).post(protect, createRecipe);

router
  .route("/:id")
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

router.route("/:id/comments").post(protect, addComment);

router.route("/:id/comments/:commentId").delete(protect, deleteComment);

router.route("/:id/comments/:commentId").put(protect, editComment);

router.route("/:id/rate").post(protect, rateRecipe);

router.route("/:id/favorite").post(protect, toggleFavorite);

router.route("/favorites").get(protect, getFavorites);

export default router;
