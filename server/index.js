import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://bkumarshaw94_db_user:w9jprA2DMTDmhQCr@cluster0.ntt1tmr.mongodb.net/?appName=Cluster0";

app.use(cors());
app.use(express.json());

let db;

async function initMongo() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db("playntric");
    console.log("Connected successfully to MongoDB Atlas (playntric db)");
  } catch (err) {
    console.error("MongoDB Atlas Connection Error:", err);
  }
}

initMongo();

// Leaderboard GET endpoint
app.get("/api/leaderboard", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: "Database not connected yet" });
    }
    const { game } = req.query;
    const filter = game ? { game } : {};
    const scores = await db
      .collection("scores")
      .find(filter)
      .sort({ score: -1 })
      .limit(200)
      .toArray();

    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard POST endpoint
app.post("/api/leaderboard", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: "Database not connected yet" });
    }
    const { game, player_name, score, metadata } = req.body || {};
    if (!game || !player_name || typeof score !== "number") {
      return res.status(400).json({ error: "Missing game, player_name, or score" });
    }

    const doc = {
      game,
      player_name: player_name.trim(),
      score,
      metadata: metadata || {},
      created_at: new Date(),
    };

    const result = await db.collection("scores").insertOne(doc);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Playntric MongoDB Backend running on http://localhost:${PORT}`);
});
