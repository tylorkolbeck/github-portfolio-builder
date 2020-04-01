const express = require("express");
const GhPort = require("./GhPort.js");

const app = express();
const port = 3000;

let ghport = new GhPort("tylorkolbeck", process.env.USER_TOKEN);

// Get marked repos with descriptions
app.get("/reposDesc", (req, res) => {
  ghport.reposDescription().then(repos => res.send(repos));
});

// Get marked repos with their contents
app.get("/reposContent", (req, res) => {
  ghport.reposWithContent().then(repos => res.send(repos));
});

app.get("/req_remaining", (req, res) => {
  res.send(ghport.requestsRemaining);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
