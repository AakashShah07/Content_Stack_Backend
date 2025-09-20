// routes/advancedSuggestionsRoute.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const News = require("../Model/newsModel"); 

router.get("/", async (req, res) => {
  const q = req.query.q ? req.query.q.trim() : "";
  if (!q) {
    return res.json([]); // no input, no suggestions
  }

  try {
    const results = await News.aggregate([
  {
    $search: {
      index: "auto",
      compound: {
        should: [
          {
            autocomplete: {
              query: q,
              path: "title",
              fuzzy: { maxEdits: 1, prefixLength: 1 }
            }
          },
          {
            autocomplete: {
              query: q,
              path: "description",
              fuzzy: { maxEdits: 1, prefixLength: 1 }
            }
          },
          {
            text: {
              query: q,
              path: ["title", "description"],
              fuzzy: { maxEdits: 1 }
            }
          }
        ]
      }
    }
  },
  { $limit: 10 },
  { $project: { _id: 0, title: 1 } }
]);


    res.json(results.map(r => r.title));
  } catch (err) {
    console.error("Atlas Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
