const express = require("express");
const connectDB = require("./Database/db");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();
app.use(express.json());


// Import routes
const entriesRoutes = require("./routes/entriesRoute");
const searchRoutes = require("./routes/searchRoute");
const webhookRoutes  = require("./routes/webhookRoute")

// Use routes
app.use("/entries", entriesRoutes);
app.use("/search", searchRoutes);
app.use("/webhook", webhookRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
