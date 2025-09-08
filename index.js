const express = require("express");
const connectDB = require("./Database/db");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Import routes
const entriesRoutes = require("./routes/entriesRoute");

// Use routes
app.use("/entries", entriesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
