import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRecipeTranslation extends Document {
  recipeId: Types.ObjectId;
  targetLang: string;
  sourceHash: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RecipeTranslationSchema = new Schema<IRecipeTranslation>(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
      index: true,
    },
    targetLang: { type: String, required: true },
    sourceHash: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
  },
  { timestamps: true }
);

RecipeTranslationSchema.index(
  { recipeId: 1, targetLang: 1 },
  { unique: true }
);

export default mongoose.model<IRecipeTranslation>(
  "RecipeTranslation",
  RecipeTranslationSchema
);
