const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const db = mongoose.connection;
const collectionName = "news";

// GET latest 40 entries
router.get("/", async (req, res) => {
  try {
    const latestEntries = await db.collection(collectionName)
      .find({})
      .sort({ created_at: -1 })  // newest first
      .limit(40)
      .toArray();

    res.json({ success: true, data: latestEntries });
  } catch (error) {
    console.error("Error fetching latest entries:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
