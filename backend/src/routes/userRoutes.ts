import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getUserProfile,
  updateUserProfile,
  checkIsFavorite,
  getUserRecipes,
  getFollowStatus,
  toggleFollow,
} from "../controllers/userController";
import { optionalAuth, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.get("/recipes", protect, getUserRecipes);
router.route("/favorites").get(protect, getFavorites);
router
  .route("/favorites/:recipeId")
  .post(protect, addToFavorites)
  .delete(protect, removeFromFavorites);
router.get("/favorites/check/:recipeId", protect, checkIsFavorite);
router.get("/:id/follow", optionalAuth, getFollowStatus);
router.post("/:id/follow", protect, toggleFollow);

export default router;
