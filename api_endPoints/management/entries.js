require("dotenv").config();

const axios = require("axios");

async function fetchEntryDetails(entryUid) {
    console.log(`https://${process.env.BASE_URL}/v3/content_types/${entryUid}/entries`)
  try {
    const response = await axios.get(
      `https://${process.env.BASE_URL}/v3/content_types/${entryUid}/entries`,
      {
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY,
          authorization: process.env.MANAGEMENT_TOKEN, // 👈 use Management Token here
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response data is ",response.data)
    return response.data.entries; // full entry details
  } catch (err) {
    console.error("❌ Error fetching entry details:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { fetchEntryDetails };
