// models/news.js
const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, required: true },
    title: String,
    author: String,
    source: String,
    description: String,
    url: Object,           // e.g. { title: String, href: String }
    content: String,
    locale: String,
    created_at: Date,
    imageUrl: String,
    publishedAt: Date,
    updated_at: Date,
    embedding: [Number],   // vector from your embedder
    category: String, // e.g. "technology", "sports", etc.
  }
);

module.exports = mongoose.model("News", newsSchema);
