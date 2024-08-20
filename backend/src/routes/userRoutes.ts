import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getUserProfile,
  checkIsFavorite,
  getUserRecipes,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.get("/recipes", protect, getUserRecipes);
router.route("/favorites").get(protect, getFavorites);
router
  .route("/favorites/:recipeId")
  .post(protect, addToFavorites)
  .delete(protect, removeFromFavorites);
router.get("/favorites/check/:recipeId", protect, checkIsFavorite);

export default router;
