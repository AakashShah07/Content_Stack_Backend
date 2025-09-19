const mongoose = require("mongoose");
// const { pipeline } = require("@xenova/transformers");

require("dotenv").config();

let embedder;

async function generateEmbedding(text) {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}
async function searchEntry(query) {

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const doc = await mongoose.connection.db.collection('news').findOne();
    console.log(doc.embedding.length); 
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
              limit: 10,                    // how many top matches to return
              similarity: "cosine"         // must match your index similarity
            }
          },
          {
            $project: {
              title: 1,
              description: 1,
              publishedAt: 1,
              content:1,
              score: { $meta: "vectorSearchScore" } // show similarity score
              
            }
          }
        ])
        .toArray();
    return results;
  } catch (error) {
    console.log("Error in method file ",error)
  }
    


}

module.exports= {searchEntry}