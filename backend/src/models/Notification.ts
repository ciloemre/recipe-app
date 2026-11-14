import mongoose, { Schema, Document } from "mongoose";

export const NOTIFICATION_TYPES = [
  "RECIPE_COMMENT",
  "COMMENT_LIKE",
  "COMMENT_REPLY",
  "REPLY_LIKE",
  "RECIPE_RATING",
  "RECIPE_FAVORITE",
  "USER_FOLLOW",
  "RECIPE_SHARED",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: NotificationType;
  recipe?: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
  targetId?: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: NOTIFICATION_TYPES },
    recipe: { type: Schema.Types.ObjectId, ref: "Recipe" },
    commentId: { type: Schema.Types.ObjectId },
    targetId: { type: Schema.Types.ObjectId },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);
