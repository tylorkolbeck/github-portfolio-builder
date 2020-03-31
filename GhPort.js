const fetch = require("node-fetch");
require("dotenv").config();

// FUTURE: Implement the userauth API to allow editing posts right on your website
// Limit

// Make aware of environment client | node

class GhPort {
  constructor(gh_userName, userToken) {
    this.gh_userName = gh_userName;
    this.user_token = userToken;
    this.requests_remaining = "";
  }

  baseURL = "https://api.github.com";
  apiCalls = 0;
  user_token = "";

  get requestsRemaining() {
    return `Requests Remaing ${this.requests_remaining}`;
  }

  set requestsRemaining(value) {
    this.requests_remaining = value;
  }

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
  getAllRepos(sort = "created", direction = "desc") {
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
   * This is the safest method to use because it first
   * gets the marked repos and then the contents of the ghport.md file
   * for each.
   *
   * This may be the only user facing function to avoid excessive API calls
   *
   * @return {promise} The marked repos with ghport contents
   */
  async ghPortRepos() {
    let allRepos = await this.getAllRepos();
    let markedRepos = await this.getMarkedRepos(allRepos);

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
   *
   * Determine which repos are marked and return those
   * @param  {array} repos
   * @return {array}          Array of marked repos(no ghport content)
   */
  getMarkedRepos(repos) {
    let marked_repos = repos.filter(repo => {
      return repo.topics.includes("ghport");
    });

    return marked_repos;
  }

  __getGhFileContents(repoName) {
    this.apiCalls++;
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
