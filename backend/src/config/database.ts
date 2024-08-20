import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI veya MONGODB_URI çevre değişkeni tanımlanmamış!");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`MongoDB Bağlantı Hatası: ${error.message}`);
    } else {
      console.error("MongoDB Bağlantısında bilinmeyen bir hata oluştu");
    }
    process.exit(1);
  }
};

export default connectDB;
