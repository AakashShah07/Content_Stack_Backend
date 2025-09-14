import { pipeline } from "@xenova/transformers";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// const ai = new GoogleGenAI({ apiKey: "API Key" });
await mongoose.connect(process.env.MONGODB_URI);

const doc = await mongoose.connection.db.collection('news').findOne();
console.log(doc.embedding.length); // should print 3072

const embedder = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

function buildText(doc) {
  return `
  Title: ${doc.title || ""}
  Author: ${doc.author || ""}
  Source: ${doc.source || ""}
  Description: ${doc.description || ""}
  Content: ${doc.content || ""}
  PublishedAt: ${doc.created_at || ""}
  `;
}

async function generateEmbedding(text) {
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // -> Float32Array → plain JS array (len 384)
}


async function searchNews(query) {
  // 1. Get embedding for the query
    const queryVector = await generateEmbedding(query);

  // 2. Run Atlas vector search
  const results = await mongoose.connection.db
    .collection("news")
    .aggregate([
      {
        $vectorSearch: {
          index: "newVectorSearch",    // ✅ the name you created
          path: "embedding",
          queryVector,
          numCandidates: 300,          // how many docs to consider
          limit: 5,                    // how many top matches to return
          similarity: "cosine"         // must match your index similarity
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          publishedAt: 1,
          score: { $meta: "vectorSearchScore" } // show similarity score
          
        }
      }
    ])
    .toArray();

    for (const doc of results) {
        console.log(doc)
    // console.log(`Author: ${doc.author}\nContent: ${doc.content}\nScore: ${doc.score}\n`);
  }
  console.log("Done")
  mongoose.connection.close()
}

searchNews("latest bitcoin market trends");
