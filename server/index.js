import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://bkumarshaw94_db_user:w9jprA2DMTDmhQCr@cluster0.ntt1tmr.mongodb.net/?appName=Cluster0";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection & Server Start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas!");
    app.listen(PORT, () => {
      console.log(`🚀 Authentication Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err.message);
    // Still start server to allow graceful reporting
    app.listen(PORT, () => {
      console.log(
        `⚠️ Authentication Server running on http://localhost:${PORT} (MongoDB disconnected)`
      );
    });
  });
