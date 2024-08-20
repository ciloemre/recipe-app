import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAuthor {
  _id: mongoose.Types.ObjectId | string;
  username: string;
}

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IAuthor;
  text: string;
  date: Date;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author: IAuthor | mongoose.Types.ObjectId;

  favorites: mongoose.Types.ObjectId[];
  favoriteCount: number;
  image: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ratings: { user: mongoose.Types.ObjectId; value: number }[];
  averageRating: number;
  calculateAverageRating: () => number;
  comments: Types.DocumentArray<IComment & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
    category: { type: String },
    prepTime: { type: Number },
    cookTime: { type: Number },
    servings: { type: Number },
    comments: [commentSchema],
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        value: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

RecipeSchema.methods.calculateAverageRating = function (this: IRecipe): number {
  if (this.ratings.length === 0) {
    return 0;
  }
  const sum = this.ratings.reduce((acc, item) => item.value + acc, 0);
  this.averageRating = sum / this.ratings.length;
  return this.averageRating;
};

RecipeSchema.pre("save", function (this: IRecipe, next) {
  if (this.isModified("ratings")) {
    this.calculateAverageRating();
  }
  next();
});

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);
