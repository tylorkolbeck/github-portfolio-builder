const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

let USER_TOKEN = process.env.USER_TOKEN;
let USER_NAME = process.env.USER_NAME;

// FUTURE: Implement the userauth API to allow editing posts right on your website

// Make aware of environment client | node

class GhPort {
  constructor(gh_userName, userToken = "") {
    this.gh_userName = gh_userName;
    this.user_token = userToken;
  }

  baseURL = "https://api.github.com";
  apiCalls = 0;

  /**
   *
   * @param {string} sort
   * sort the returned repos by create | pushed | updated
   * Default: created
   *
   * @param {string} direction
   * asc | desc
   * Default: desc
   *
   * @param {bool} formatted
   * If true then return only data needed to
   * make cards, else return the entire raw response
   * Default: true
   */
  getAllRepos(sort = "created", direction = "desc", formatted = true) {
    this.apiCalls++;
    return fetch(this.__buildQueryString(sort, direction), {
      headers: {
        // to return topics
        Accept:
          "application/vnd.github.mercy-preview+json+raw, application/vnd.github.v3.raw"
      }
    })
      .then(res => {
        return res.json().then(res => {
          if (res.length > 0 && formatted) {
            return this.__formatRawRepoList(res);
          } else if (res.length && !formatted) {
            return res;
          } else {
            return null;
          }
        });
      })
      .catch(err => err.message);
  }

  /**
   * Get and return all ghport repos with the ghport.md
   * contents.
   */
  async ghRepos() {
    let allRepos = await this.getAllRepos();
    let markedRepos = await this.getMarkedRepos(allRepos);
    this.apiCalls += markedRepos.length;

    let reposContentPromises = markedRepos.map(async repo => {
      let content = await this.__getGhFileContents(repo.name);

      return {
        ...repo,
        content: content
      };
    });

    let finalRepos = await Promise.all(reposContentPromises);

    return finalRepos;
  }

  getMarkedRepos(repos) {
    let marked_repos = repos.filter(repo => {
      return repo.topics.includes("ghport");
    });

    return marked_repos;
  }

  __getGhFileContents(repoName) {
    return this.__getGhPortFileContents(repoName)
      .then(data => {
        return data;
      })
      .catch(err => console.log(err));
  }

  __getGhPortFileContents(repoName) {
    let queryParam = `${this.baseURL}/repos/${this.gh_userName}/${repoName}/contents/ghport.md`;

    return fetch(queryParam, {
      headers: {
        Accept: "application/vnd.github.v3.raw"
      }
    })
      .then(res => {
        return res
          .text()
          .then(data => data)
          .catch(err => err);
      })
      .catch(err => console.log(err));
  }

  __buildQueryString(sort, direction) {
    return `${this.baseURL}/users/${this.gh_userName}/repos${
      sort ? `?sort=${sort}&` : `?sort=created&`
    }${direction ? `direction=${direction}` : `direction=desc`}`;
  }

  __formatRawRepoList(reposRaw) {
    return reposRaw.map(repo => {
      return {
        id: repo.id,
        name: repo.name,
        url: repo.owner.html_url,
        description: repo.description,
        commits: 0,
        sshUrl: repo.ssh_url,
        stars: repo.stargazers_count,
        created: repo.created_at,
        updated: repo.updated_at,
        hasPages: repo.has_pages,
        hasIssues: repo.has_issues,
        topics: repo.topics
      };
    });
  }
}

module.exports = GhPort;

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
