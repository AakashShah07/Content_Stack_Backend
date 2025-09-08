const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentstackId: { type: String, required: true }
},{collation:"Entry"});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
