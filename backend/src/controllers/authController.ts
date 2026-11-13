import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../utils/customError";

const authService = new AuthService();

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9]).{8,}$/;

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "İsim en az 2 karakter olmalıdır" });
    }

    if (typeof username !== "string" || username.length < 3) {
      return res
        .status(400)
        .json({ message: "Kullanıcı adı en az 3 karakter olmalıdır" });
    }

    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        message: "Kullanıcı adı yalnızca harf, rakam ve alt çizgi içerebilir",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Geçersiz email formatı" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Şifre en az 8 karakter olmalı ve büyük/küçük harf, rakam ile özel karakter içermelidir",
      });
    }

    try {
      const { user, token } = await authService.register({
        username,
        name: name.trim(),
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
