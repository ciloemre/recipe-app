import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
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
      // Token geçerli mi kontrol et
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
