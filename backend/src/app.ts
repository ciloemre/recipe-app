import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import userRoutes from "./routes/userRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import translateRoutes from "./routes/translateRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(limiter);

const configuredOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

function isAllowedOrigin(origin?: string) {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on("connection", (socket) => {
  console.log("A user connected");

  const joinUserRoom = (payload: unknown) => {
    const raw =
      typeof payload === "string"
        ? payload
        : payload && typeof payload === "object"
          ? "userId" in payload
            ? (payload as { userId?: unknown }).userId
            : "_id" in payload
              ? (payload as { _id?: unknown })._id
              : ""
          : "";
    const userId = String(
      raw && typeof raw === "object" && "_id" in raw
        ? (raw as { _id?: unknown })._id
        : raw || ""
    );
    if (/^[a-f\d]{24}$/i.test(userId)) {
      socket.join(`user_${userId}`);
    }
  };

  socket.on("identify", joinUserRoom);
  socket.on("authenticate", joinUserRoom);
  socket.on("joinUserRoom", joinUserRoom);

  socket.on("recipeRated", (data) => {
    console.log("Recipe rated:", data);
    io.emit("recipeRated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/translate", translateRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server, io };
