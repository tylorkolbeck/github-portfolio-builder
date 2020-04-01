const fetch = require("node-fetch");
const errorHandler = require("./logError.js");
require("dotenv").config();

// TODO: Cache responses from server and only fetch new data ever x minutes for testing
// TODO: rename public methods

// Public Functions:
// reposContent - returns all marked repos along with the contents of the ghport.md file
// reposDescription
//

class GhPort {
  constructor(gh_userName, userToken, useCaching = false) {
    // Create handle to error logging file
    this.errorStreamHandle = errorHandler.createFileStreamHandle("log.txt");

    // If not user name provided thow error
    if (!gh_userName) {
      throw new Error("You must supply a github user name to class GhPort");
    }

    // If not authorization token given log caution to log.txt
    if (!userToken) {
      errorHandler.writeToStream(
        this.errorStreamHandle,
        `CAUTION: You have not passed a GitHub personal access token.
         Your API will be limited to 60 requests an hour which will
         quickly run out if you have a large number of marked repos.`
      );
    }

    if (useCaching) {
      this.cache_enabled = true;
    }

    this.gh_userName = gh_userName;
    this.user_token = userToken;
    this.requests_remaining = "";
  }

  baseURL = "https://api.github.com";
  apiCalls = 0;
  user_token = "";
  cache_enabled = false; // true || false set on initilization set by user
  cache_data = null; // store returned data here in an object to reference later
  last_fetch_time = null; // record the last time data was fetched with the github API

  // FOR TESTING ADD ACTUAL GITHUB API CALL TO GET REMAINING API REQUESTS
  get requestsRemaining() {
    return `Requests Remaing ${this.requests_remaining}`;
  }

  set requestsRemaining(value) {
    this.requests_remaining = value;
  }

  /**
   * Gets all repos associated with the github username
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
  __getAllRepos(sort = "created", direction = "desc", formatted = true) {
    this.apiCalls++;
    return fetch(this.__buildQueryString(sort, direction), {
      headers: {
        // to return topics
        Accept:
          "application/vnd.github.mercy-preview+json+raw, application/vnd.github.v3.raw",
        authorization: this.user_token ? `Bearer ${this.user_token}` : ""
      }
    })
      .then(res => {
        this.requestsRemaining = res.headers.get("x-ratelimit-remaining");

        return res.json().then(res => {
          if (res.length > 0) {
            if (formatted) {
              return this.__buildRepoReturnData(res);
            } else {
              return res;
            }
          } else {
            return [];
          }
        });
      })
      .catch(err => err.message);
  }

  /**
   * This is the safest method to use because it first
   * gets the marked repos and then the contents of the ghport.md file
   * for each.
   *
   * This may be the only user facing function to avoid excessive API calls
   *
   * @return {promise} The marked repos with ghport contents
   */
  async reposWithContent() {
    let allRepos = await this.__getAllRepos();
    let markedRepos = await this.__filterMarkedRepos(allRepos);

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

  /**
   * gets all repos then filters out the ones that are marked
   * with ghport topic and returns them in an array.
   * @returns {array}   marked repos
   */
  reposDescription() {
    return this.__getAllRepos().then(repos => {
      let filteredRepos = this.__filterMarkedRepos(repos);
      return filteredRepos;
    });
  }

  /**
   *
   * Determine which repos are marked and return those
   * @param  {array} repos
   * @return {array}          Array of marked repos(no ghport content)
   */
  __filterMarkedRepos(repos) {
    let marked_repos = repos.filter(repo => {
      return repo.topics.includes("ghport");
    });

    return marked_repos;
  }

  __getGhFileContents(repoName) {
    this.apiCalls++;
    return this.__getThisReposContent(repoName)
      .then(data => {
        return data;
      })
      .catch(err => console.log(err));
  }

  /**
   *
   * GETS SPECIFIC REPOS CONTENTS
   * @param {string} repoName
   *
   */
  __getThisReposContent(repoName) {
    let queryParam = `${this.baseURL}/repos/${this.gh_userName}/${repoName}/contents/ghport.md`;

    return fetch(queryParam, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        authorization: this.user_token ? `Bearer ${this.user_token}` : ""
      }
    })
      .then(res => {
        this.requestsRemaining = res.headers.get("x-ratelimit-remaining");
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

  __buildRepoReturnData(reposRaw) {
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
