// import { GhPort } from "./main.js";
const GhPort = require("./GhPort");

// Create instance of GhPort
let userGhPort = new GhPort("tylorkolbeck");

// Get
userGhPort.ghRepos().then(repos => {
  console.log(repos);
  console.log("GITHUB API CALLS: ", userGhPort.apiCalls);
});

/**
 * @returns {array} of all repos
 */
// userGhPort;
// getAllRepos([filter[, order[, formatted]]])
// .getAllRepos();

/**
 * @returns {array} of repos marked with the topic ghport
 */

// userGhPort
// getMarkedRepos([filter[, order[, formatted]]])
// .getMarkedRepos()

// .then(
//   res => writeToFile(res)
// .then(() => console.log("DONE"))
// .catch(err => console.log(err))
// )
// .catch(err => console.log(err));

// userGhPort
//   .__getGhPortFileContents("github-portfolio-builder")
//   .then(res =>
//     writeToFile(res)
//       .then(() => console.log("DONE"))
//       .catch(err => console.log(err))
//   )
//   .catch(err => console.log(err));

// function writeToFile(res) {
//   fs.writeFile("reposFormatted.json", JSON.stringify(res, null, " "), err =>
//     console.log(err)
//   );
// }

// console.log(process.env.USER_TOKEN);

// async function buildMarkedRepos() {
//   let allRepos = await userGhPort.getAllRepos();
//   let markedRepos = await userGhPort.getMarkedRepos(allRepos);

//   let reposContentPromises = markedRepos.map(async repo => {
//     let content = await getRepoContents(repo.name);

//     return {
//       ...repo,
//       content: content
//     };
//   });

//   let finalRepos = await Promise.all(reposContentPromises);

//   return finalRepos;
// }

// buildMarkedRepos().then(repos => console.log(repos));

// function getRepoContents(repoName) {
//   return userGhPort
//     .__getGhPortFileContents(repoName)
//     .then(data => {
//       return data;
//     })
//     .catch(err => console.log(err));
// }

// Create instance of GhPort
// let userGhPort = new GhPort("tylorkolbeck");

// // Get
// userGhPort.ghRepos().then(repos => {
//   console.log(repos);
//   console.log("GITHUB API CALLS: ", userGhPort.apiCalls);
// });
