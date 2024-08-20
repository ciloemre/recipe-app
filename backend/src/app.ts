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
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(helmet());
app.use(limiter);

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on("connection", (socket) => {
  console.log("A user connected");

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

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server, io };
