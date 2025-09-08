const connectDB = require("./Database/db")
const Entry  =  require("./Model/entryModel")
const express = require("express");
const app = express();

require("dotenv").config();
const contentstack = require("contentstack");
const { connect } = require("mongoose");

connectDB();

const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
   region: contentstack.Region.EU, 

});


app.get("/", async (req, res) => {
 try {
    const query = Stack.ContentType("test").Query();
    query
    .where("title")
    .includeContentType()
    .includeCount()
    .toJSON()
    .find()
    .then(function success(result) { }, function error(err) {
        // err object
    })
    const result = await query.find();

    result[0].forEach(async (entry) => {
     const saved =  await Entry.findOneAndUpdate(
        { contentstackId: entry.uid }, // ensure correct UID
        { title: entry.title, contentstackId: entry.uid },
        { upsert: true, new: true })
                  console.log("✅ Saved in MongoDB:", saved);

    })
    // for (const entry of entries) {
    //   console.log("📌 Entry from Contentstack:", entry);

    //   const saved = await Entry.findOneAndUpdate(
    //     { contentstackId: entry.uid }, // ensure correct UID
    //     { title: entry.title, contentstackId: entry.uid },
    //     { upsert: true, new: true })
      
    // }
          console.log("✅ Saved in MongoDB:");

  } catch (err) {
    console.error("Error fetching entries:", err);
  }
  res.send("Hello World from Node.js!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
