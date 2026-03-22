import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve images
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/polls", pollRoutes);
app.use("/api/auth", authRoutes); // ✅ FIXED

// ✅ DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => console.log("DB Error:", err));