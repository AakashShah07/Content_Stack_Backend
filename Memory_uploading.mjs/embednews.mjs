import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

// --- Mongo Connection ---
await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("✅ Connected to MongoDB");

// --- Model ---
const newsSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  title: String,
  author: String,
  source: String,
  description: String,
  url: Object,
  content: String,
  locale: String,
  created_at: Date,
  updated_at: Date,
  embedding: [Number],
});
const News = mongoose.model("News", newsSchema);

// --- Google GenAI Setup ---
const ai = new GoogleGenAI({ apiKey: "API Key" });

async function embedOne(doc) {
  const text = `
    Title: ${doc.title}
    Author: ${doc.author || ""}
    Source: ${doc.source || ""}
    Description: ${doc.description || ""}
    Content: ${doc.content || ""}
      PublishedAt: ${doc.publishedAt || ""}

  `;
  const res = await ai.models.embedContent({
    model: "text-embedding-3-large",
    contents: text,
    outputDimensionality:2048
  });

  // The embedding is inside res.embeddings[0].values (array of floats)
  const vector = res.embeddings[0].values;
  await News.updateOne({ _id: doc._id }, { $set: { embedding: vector } });
  console.log(`✅ Embedded ${doc.title}`);
}

async function main() {
  const docs = await News.find({
  $or: [
    { embedding: { $exists: false } },
    { embedding: null }
  ]
});
  // await News.updateMany({}, { $unset: { embedding: "" } });


  console.log(`Not Embedding ${docs.length} documents…`);

  await News.deleteMany({
  $or: [
    { embedding: { $exists: false } }, // field doesn't exist
    { embedding: null }                // field exists but is null
  ]
});
  console.log(`Docs deleted`);



  // for (const doc of docs) {
  //   try {
  //     await embedOne(doc);
  //     break;
  //   } catch (err) {
  //     console.error(`❌ Error embedding ${doc.uid}:`, err.message);
  //   }
  // }

  mongoose.disconnect();
  console.log("🎉 All embeddings stored");
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
