const express = require("express");
const app = express();

require("dotenv").config();
const contentstack = require("contentstack");

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

    result[0].forEach((entry) => {
      console.log("Title:", entry.title);
    });
  } catch (err) {
    console.error("Error fetching entries:", err);
  }
  res.send("Hello World from Node.js!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
