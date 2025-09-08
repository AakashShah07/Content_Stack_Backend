const express = require("express");
const router = express.Router();
const Entry = require("../Model/entryModel");
const { fetchEntryDetails, createEntry } = require("../api_endPoints/management/entries");

// GET entry by UID
router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: "❌ Please provide entry uid in query" });
    }

    const fullEntry = await fetchEntryDetails(uid);

    if (!fullEntry) {
      return res.status(404).json({ error: "❌ Entry not found" });
    }

    for (const entry of fullEntry) {
      console.log("📌 Entry from Contentstack:", entry);

      await Entry.findOneAndUpdate(
        { contentstackId: entry.uid },
        { title: entry.title, contentstackId: entry.uid },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Saved in MongoDB:");
    res.json({ message: "Entries saved successfully!" });

  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create a new entry
router.post("/", async (req, res) => {
  try {
    const { contentType, entryData } = req.body;

    if (!contentType || !entryData) {
      return res.status(400).json({ error: "❌ Please provide contentType and entryData in body" });
    }

    const createdEntry = await createEntry(contentType, entryData);

    if (!createdEntry) {
      return res.status(500).json({ error: "❌ Failed to create entry" });
    }

    // Optionally, save it in MongoDB as well
    await Entry.findOneAndUpdate(
      { contentstackId: createdEntry.entry.uid },
      { title: createdEntry.entry.title, contentstackId: createdEntry.entry.uid },
      { upsert: true, new: true }
    );

    console.log("✅ Entry created and saved in MongoDB:", createdEntry.entry);
    res.status(201).json({ message: "Entry created successfully!", entry: createdEntry.entry });

  } catch (err) {
    console.error("Error creating entry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
