import mongoose from "mongoose";
import Recipe, { IRecipe } from "../models/Recipe";

const listProjection = {
  title: 1,
  description: 1,
  image: 1,
  category: 1,
  prepTime: 1,
  cookTime: 1,
  servings: 1,
  ingredients: 1,
  instructions: 1,
  author: 1,
  averageRating: 1,
  createdAt: 1,
  updatedAt: 1,
  commentCount: { $size: { $ifNull: ["$comments", []] } },
  ratingCount: { $size: { $ifNull: ["$ratings", []] } },
};

const authorLookup = {
  $lookup: {
    from: "users",
    localField: "author",
    foreignField: "_id",
    as: "author",
    pipeline: [{ $project: { username: 1, name: 1, avatar: 1 } }],
  },
};

export async function findRecipesForList(
  match: Record<string, unknown> = {}
): Promise<IRecipe[]> {
  const pipeline: mongoose.PipelineStage[] = [];

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $project: listProjection },
    authorLookup,
    { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
  );

  return (await Recipe.aggregate(pipeline)) as IRecipe[];
}
