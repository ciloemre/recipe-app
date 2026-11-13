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
  toggleCommentLike,
  addCommentReply,
  deleteCommentReply,
  toggleReplyLike,
} from "../controllers/recipeController";
import { protect, optionalAuth } from "../middleware/authMiddleware";

const router = express.Router();

// Public reads (optionalAuth so req.user?.id is available when logged in)
router.route("/").get(optionalAuth, getAllRecipes).post(protect, createRecipe);

// Authenticated favorites list must be registered before /:id
router.route("/favorites").get(protect, getFavorites);

router
  .route("/:id")
  .get(optionalAuth, getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

router.route("/:id/comments").post(protect, addComment);

router
  .route("/:id/comments/:commentId/like")
  .post(protect, toggleCommentLike);

router
  .route("/:id/comments/:commentId/replies")
  .post(protect, addCommentReply);

router
  .route("/:id/comments/:commentId/replies/:replyId/like")
  .post(protect, toggleReplyLike);

router
  .route("/:id/comments/:commentId/replies/:replyId")
  .delete(protect, deleteCommentReply);

router.route("/:id/comments/:commentId").delete(protect, deleteComment);

router.route("/:id/comments/:commentId").put(protect, editComment);

router.route("/:id/rate").post(protect, rateRecipe);

router.route("/:id/favorite").post(protect, toggleFavorite);

export default router;
