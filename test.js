// import { GhPort } from "./main.js";
const GhPort = require("./GhPort");

// Create instance of GhPort
let userGhPort = new GhPort("tylorkolbeck");

// Get
userGhPort.ghRepos().then(repos => {
  console.log(repos);
  console.log("GITHUB API CALLS: ", userGhPort.apiCalls);
});
