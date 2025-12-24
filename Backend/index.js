import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoute.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config/db.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

// Cloudinary
cloudinary.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_Api_Key,
  api_secret: process.env.Cloudinary_Api_Secret,
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 FIX 1: NO TRAILING SLASH
const FRONTEND_URL = "https://social-media-nu-two.vercel.app";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// HTTP + Socket.IO
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], // 🔥 FIX 2: FORCE WEBSOCKET
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("send_message", (data) => {
    if (data.receiverId) {
      io.to(data.receiverId).emit("receive_message", data);
    }
    if (data.sender) {
      io.to(data.sender).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});