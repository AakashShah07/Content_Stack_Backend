import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// 1. Mongo connection
await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("✅ Connected to MongoDB");

// 2. Schema & Model
const newsSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  title: String,
  author: String,
  source: String,
  description: String,
  url: Object,           // { title, href }
  content: String,
  locale: String,
  created_at: Date,
  updated_at: Date,
  embedding: [Number],   // <── store the vector here

});

const News = mongoose.model("News", newsSchema);

// 3. Fetch from Contentstack
const API_KEY = process.env.CONTENTSTACK_API_KEY;
const AUTH_TOKEN = process.env.CONTENTSTACK_AUTH_TOKEN;
const endpoint =
  "your end point";

async function fetchEntries(skip = 0, limit = 1) {
  // Supports pagination if you have 200+ entries
  const res = await axios.get(endpoint, {
    headers: {
        api_key: "you key",
      authorization: "management key",
      "Content-Type": "application/json",
    },
    params: { skip, limit },
  });
  return res.data.entries;
}

let embedder; // keep it global so it's loaded only once
async function generateEmbedding(text) {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // Float32Array → plain JS array
}

async function main() {
  let skip = 0;
  const limit = 100;
  let allEntries = [];

  while (true) {
    const entries = await fetchEntries(skip, limit);
    if (!entries.length) break;
    allEntries = allEntries.concat(entries);
    skip += limit;
  }

  console.log(`Fetched ${allEntries.length} entries from Contentstack`);

  // 4. Insert into MongoDB (upsert to avoid duplicates)
   for (const entry of allEntries) {
    // Pick text to embed – here we combine title + description + content
    const textToEmbed =
      `${entry.title || ""}\n${entry.description || ""}\n${entry.content || ""}`;
    const vector = await generateEmbedding(textToEmbed);

    await News.findOneAndUpdate(
      { uid: entry.uid },
      {
        uid: entry.uid,
        title: entry.title,
        author: entry.author,
        source: entry.source,
        description: entry.description,
        url: entry.url,
        content: entry.content,
        locale: entry.locale,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        embedding: vector, // ⬅️ store embedding
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("✅ All entries saved to MongoDB with embeddings");

  // console.log("✅ All entries saved to MongoDB");
  mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  mongoose.disconnect();
});
