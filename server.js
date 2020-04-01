const express = require("express");
const GhPort = require("./GhPort.js");

const app = express();
const port = process.env.PORT;

let ghportSettings = {
  format: "raw",
  cache: false,
  token: process.env.USER_TOKEN
};

let ghport = new GhPort("tylorkolbeck", ghportSettings);

// Get marked repos with descriptions
app.get("/desc", (req, res) => {
  ghport.reposDescription().then(repos => res.send(repos));
});

// Get marked repos with their contents
app.get("/content", (req, res) => {
  ghport.reposWithContent().then(repos => res.send(repos));
});

app.get("/req_remaining", (req, res) => {
  res.send(ghport.requestsRemaining);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
