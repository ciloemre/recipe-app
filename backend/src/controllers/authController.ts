import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../utils/customError";

const authService = new AuthService();

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    try {
      const { user, token } = await authService.register({
        username,
        name,
        email,
        password,
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        token,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password);

  res.json({
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    token,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token bulunamadı" });
  }

  await authService.logout(token);
  res.json({ message: "Başarıyla çıkış yapıldı" });
});
