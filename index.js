const express = require("express");
const connectDB = require("./Database/db");
require("dotenv").config();
const cors = require('cors');
const fetch = require("node-fetch"); // or axios


const app = express();

app.use(cors())

// Connect Database
connectDB();
app.use(express.json());


// Import routes
const entriesRoutes = require("./routes/entriesRoute");
const searchRoutes = require("./routes/searchRoute");
const webhookRoutes  = require("./routes/webhookRoute")
const advanceSuggestion  =  require("./routes/autoSuggRoute")
const latestEntryRoute = require("./routes/latestEntryRoute");

app.use("/latest-entries", latestEntryRoute);
// Use routes

app.use("/entries", entriesRoutes);
app.use("/search", searchRoutes);
app.use("/webhook", webhookRoutes);
app.use("/advanced-suggestions", advanceSuggestion);

// Function to fetch the two APIs safely
const fetchTopicAndCountryNews = async () => {
  try {
    // Fetch Topic News
    try {
      const topicRes = await fetch("https://news-updates-sooty.vercel.app/push-topic-news");
      const topicData = await topicRes.json();
      console.log("Topic News Fetched:", topicData.length || topicData);
    } catch (topicError) {
      console.error("Error fetching topic news:", topicError.message);
    }

    // Fetch Country News
    try {
      const countryRes = await fetch("https://news-updates-sooty.vercel.app/push-country-news");
      const countryData = await countryRes.json();
      console.log("Country News Fetched:", countryData.length || countryData);
    } catch (countryError) {
      console.error("Error fetching country news:", countryError.message);
    }

  } catch (error) {
    console.error("Unexpected error in fetchTopicAndCountryNews:", error.message);
  }
};

// Call immediately on server start
fetchTopicAndCountryNews();

// Schedule to run every 30 minutes (30 * 60 * 1000 ms)
setInterval(fetchTopicAndCountryNews, 30 * 60 * 1000);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
