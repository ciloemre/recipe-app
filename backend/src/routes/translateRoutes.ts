import express from "express";
import rateLimit from "express-rate-limit";
import { translateRecipe } from "../controllers/translateController";
import { translateText } from "../controllers/textTranslateController";

const router = express.Router();

const translateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/recipe", translateLimiter, translateRecipe);
router.post("/text", translateLimiter, translateText);

export default router;
