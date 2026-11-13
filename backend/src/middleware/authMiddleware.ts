import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Yetkilendirme token'ı bulunamadı" });
    }

    try {
      const isValid = await authService.isTokenValid(token);
      if (!isValid) {
        return res
          .status(401)
          .json({ message: "Geçersiz veya süresi dolmuş token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      (req as any).user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Yetkilendirme başarısız" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Yetkilendirme token'ı bulunamadı" });
  }
};

/**
 * Optional JWT auth for public-read endpoints.
 * Attaches req.user when a valid token is present; otherwise continues as guest.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const isValid = await authService.isTokenValid(token);
        if (isValid) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
          ) as { id: string };
          (req as any).user = await User.findById(decoded.id).select(
            "-password"
          );
        }
      }
    }
  } catch (error) {
    console.error("optionalAuth:", error);
    (req as any).user = undefined;
  }
  next();
};
