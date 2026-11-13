import mongoose from "mongoose";
import { Server } from "socket.io";
import Notification, { NotificationType } from "../models/Notification";

const KEEP_COUNT = 20;

export interface NotificationPayload {
  _id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  commentId?: string;
  targetId?: string;
  sender: { _id: string; name: string; username: string; avatar?: string } | null;
  recipe: { _id: string; title: string } | null;
}

function asPerson(value: unknown) {
  if (!value || typeof value !== "object" || !("_id" in value)) return null;
  const person = value as {
    _id?: unknown;
    name?: string;
    username?: string;
    avatar?: string;
  };
  if (!person._id) return null;
  return {
    _id: String(person._id),
    name: person.name?.trim() || "",
    username: person.username?.trim() || "",
    avatar: person.avatar || undefined,
  };
}

function asRecipe(value: unknown) {
  if (!value || typeof value !== "object" || !("_id" in value)) return null;
  const recipe = value as { _id?: unknown; title?: string };
  if (!recipe._id) return null;
  return { _id: String(recipe._id), title: recipe.title || "" };
}

export function serializeNotification(doc: {
  _id: unknown;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  commentId?: unknown;
  targetId?: unknown;
  sender?: unknown;
  recipe?: unknown;
}): NotificationPayload {
  return {
    _id: String(doc._id),
    type: doc.type,
    message: doc.message,
    isRead: Boolean(doc.isRead),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    commentId: doc.commentId ? String(doc.commentId) : undefined,
    targetId: doc.targetId ? String(doc.targetId) : undefined,
    sender: asPerson(doc.sender),
    recipe: asRecipe(doc.recipe),
  };
}

const DEDUPED_TYPES = new Set<NotificationType>([
  "COMMENT_LIKE",
  "REPLY_LIKE",
  "RECIPE_FAVORITE",
  "RECIPE_RATING",
  "USER_FOLLOW",
]);

function normalizeId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "object" && "_id" in value) {
    return String((value as { _id?: unknown })._id || "");
  }
  const asText = String(value);
  return asText === "undefined" || asText === "null" ? "" : asText;
}

export async function createAndEmitNotification({
  io,
  recipientId,
  senderId,
  type,
  recipeId,
  commentId,
  targetId,
  message,
}: {
  io: Server;
  recipientId: unknown;
  senderId: unknown;
  type: NotificationType;
  recipeId?: string;
  commentId?: string;
  targetId?: string;
  message: string;
}) {
  try {
  const normalizedRecipient = String(
    (recipientId as { _id?: unknown } | null)?._id || recipientId || ""
  );
  const normalizedSender = String(
    (senderId as { _id?: unknown } | null)?._id || senderId || ""
  );
  const recipient = normalizeId(normalizedRecipient);
  const sender = normalizeId(normalizedSender);
  if (!recipient || !sender || recipient === sender) {
    return null;
  }

  const fields = {
    recipient,
    sender,
    type,
    recipe: recipeId || undefined,
    commentId: commentId || undefined,
    targetId: targetId || undefined,
    message,
    isRead: false,
    createdAt: new Date(),
  };

  let notification;
  if (DEDUPED_TYPES.has(type)) {
    notification = await Notification.findOneAndUpdate(
      {
        recipient,
        sender,
        type,
        ...(recipeId ? { recipe: recipeId } : {}),
        ...(commentId ? { commentId } : {}),
        ...(targetId ? { targetId } : {}),
      },
      { $set: fields },
      { upsert: true, new: true, setDefaultsOnInsert: true, timestamps: false }
    );
  } else {
    notification = await Notification.create(fields);
  }

  if (!notification) return null;

  await notification.populate([
    { path: "sender", select: "name username" },
    { path: "recipe", select: "title" },
  ]);

  const payload = serializeNotification(notification);
  io.to(`user_${recipient}`).emit("notification:new", payload);
  try {
    await pruneNotifications(recipient);
  } catch (error) {
    console.error("Bildirim temizlenemedi:", error);
  }
  return payload;
  } catch (error) {
    console.error("Bildirim gönderilemedi:", error);
    return null;
  }
}

async function collapseDuplicates(userId: string) {
  const grouped = await Notification.aggregate<{ ids: mongoose.Types.ObjectId[] }>([
    {
      $match: {
        recipient: new mongoose.Types.ObjectId(userId),
        type: { $in: [...DEDUPED_TYPES] },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          sender: "$sender",
          type: "$type",
          recipe: "$recipe",
          commentId: "$commentId",
          targetId: "$targetId",
        },
        ids: { $push: "$_id" },
      },
    },
  ]);
  const extras = grouped.flatMap((group) => group.ids.slice(1));
  if (extras.length) {
    await Notification.deleteMany({ _id: { $in: extras } });
  }
}

async function pruneNotifications(userId: string) {
  await collapseDuplicates(userId);
  const overflow = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .skip(KEEP_COUNT)
    .select("_id");
  if (overflow.length) {
    await Notification.deleteMany({ _id: { $in: overflow.map((item) => item._id) } });
  }
}

export async function getNotifications(userId: string) {
  await pruneNotifications(userId);
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipient: userId, sender: { $exists: true } })
      .sort({ createdAt: -1 })
      .limit(KEEP_COUNT)
      .populate("sender", "name username avatar")
      .populate("recipe", "title"),
    Notification.countDocuments({
      recipient: userId,
      isRead: false,
      sender: { $exists: true },
    }),
  ]);

  return {
    notifications: notifications.map((item) => serializeNotification(item)),
    unreadCount,
  };
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  )
    .populate("sender", "name username avatar")
    .populate("recipe", "title");

  return updated ? serializeNotification(updated) : null;
}

export async function markAllNotificationsRead(userId: string) {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
}
