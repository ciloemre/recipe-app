import User, { IUser } from "../models/User";
import BlacklistedToken from "../models/BlacklistedToken";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError";

export class AuthService {
  async register(userData: {
    username: string;
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const { username, name, email, password } = userData;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        throw new CustomError("Bu e-posta adresi zaten kullanımda", 409);
      } else {
        throw new CustomError("Bu kullanıcı adı zaten kullanımda", 409);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = this.generateToken(newUser._id);

    return { user: newUser, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Geçersiz kimlik bilgileri", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Geçersiz kimlik bilgileri", 401);
    }

    const token = this.generateToken(user._id);

    return { user, token };
  }

  async logout(token: string): Promise<void> {
    const existingToken = await BlacklistedToken.findOne({ token });
    if (!existingToken) {
      await BlacklistedToken.create({ token });
    }
  }

  async isTokenValid(token: string): Promise<boolean> {
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    return !blacklistedToken;
  }

  private generateToken(userId: Types.ObjectId): string {
    return jwt.sign(
      { id: userId.toString() },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30d",
      }
    );
  }
}
