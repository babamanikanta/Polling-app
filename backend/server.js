import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/pollingdb";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use(pollRoutes);

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
