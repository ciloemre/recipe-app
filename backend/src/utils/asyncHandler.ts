import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("Hata:", error);
      if (error.name === "CastError" && error.kind === "ObjectId") {
        res.status(400).json({ message: "Geçersiz tarif ID'si" });
      } else {
        next(error);
      }
    });
