import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://bkumarshaw94_db_user:w9jprA2DMTDmhQCr@cluster0.ntt1tmr.mongodb.net/?appName=Cluster0";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(uri);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("playntric");
    const scoresCollection = db.collection("scores");

    if (req.method === "GET") {
      const { game } = req.query;
      const filter = game ? { game } : {};
      
      const rawScores = await scoresCollection
        .find(filter)
        .sort({ score: -1 })
        .limit(200)
        .toArray();

      return res.status(200).json({ success: true, scores: rawScores });
    }

    if (req.method === "POST") {
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

      const result = await scoresCollection.insertOne(doc);
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("MongoDB Leaderboard Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
