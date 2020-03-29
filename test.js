const GhPort = require("./GhPort");
const fs = require("fs");

// Create instance of GhPort
let userGhPort = new GhPort("tylorkolbeck");

/**
 *
 * @return marked repos which contain their ghport.md file contents
 */
userGhPort.ghRepos().then(repos => {
  console.log(repos);
  console.log("GITHUB API CALLS: ", userGhPort.apiCalls); // Show number of API calls used for this method
});

/**
 *
 * @param {string} filename    Filename to create and write data to
 * @param {string} data        Data to write to a file
 * @return {bool}              True if write successful else false
 *
 */
function writeToFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data, null, " "), err => {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("Write Successful");
      return true;
    }
  });
}

/**
 * @returns {array} of all repos marked or unmarked
 * getAllRepos([filter[, order[, formatted]]])
 */
//  userGhPort.getAllRepos()
//  .then(repos => console.log(repos))

/**
 * @returns {array} of repos marked with the topic ghport
 * getMarkedRepos([filter[, order[, formatted]]])
 */
// .getMarkedRepos()
//  .then(markedRepos => console.log(markedRepos))
//  .catch(err => console.log(err))
