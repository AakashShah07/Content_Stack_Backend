// webhook.mjs
const express = require("express");
require("dotenv").config();
const News =  require("../Model/newsModel")


const router = express.Router();



let embedder; // keep it global so it's loaded only once
async function generateEmbedding(text) {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // Float32Array → plain JS array
}


router.post("/", async (req, res) => {
//  
console.log("Webhook hit:"); 

    try {
        
    const entry = req.body.data.entry;    // contains the updated/created entry

    if (!entry || !entry.uid) {
      return res.status(400).send("Invalid payload");
    }
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
            imageUrl: entry.imageUrl,
            publishedAt: entry.publishedAt,
            embedding: vector, // ⬅️ store embedding
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      
    
      console.log(`✅ Updated/Created entrry ${entry.uid}`);
    res.status(200).send("ok");
    
 } catch (error) {
        console.error("❌ Webhook error:", error);
    res.status(500).send("server error");
    }

});

module.exports = router;