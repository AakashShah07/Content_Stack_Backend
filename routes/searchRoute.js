const express = require("express");
const router = express.Router();
// const Entry = require("../Model/entryModel");
const { searchEntry } = require("../api_endPoints/search/methods.js");

// GET THE BODY
router.get("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "❌ Please provide entry query in query" });
    }
    const results = await searchEntry(query);
    
     res.json({
      message: "Got the entry",
      fetchedEntries: results,
    //   mongoEntries: savedDocs,
    });

  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;