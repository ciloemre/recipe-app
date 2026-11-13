import { Response } from "express";
import { Request as ExpressRequest } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser } from "../models/User";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";

interface AuthRequest extends ExpressRequest {
  user?: IUser;
}

export const listMyNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const result = await getNotifications(userId);
    res.json(result);
  }
);

export const readNotification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    const updated = await markNotificationRead(userId, req.params.id);
    if (!updated) {
      return res.status(404).json({ message: "Bildirim bulunamadı" });
    }
    res.json(updated);
  }
);

export const readAllNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı girişi yapılmamış" });
    }
    await markAllNotificationsRead(userId);
    res.json({ ok: true });
  }
);
