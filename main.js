const fetch = require("node-fetch");
const fs = require("fs");

class GhPort {
  constructor(gh_userName) {
    this.gh_userName = gh_userName;
  }

  baseURL = "https://api.github.com";

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
   * Default: false
   */
  getAllRepos(sort, direction, formatted = true) {
    let queryString = `
    ${this.baseURL}/users/${this.gh_userName}/repos${
      sort ? `?sort=${sort}&` : `?sort=created&`
    }${direction ? `direction=${direction}` : `direction=desc`}`;

    return fetch(queryString, {
      headers: {
        Accept: "application/vnd.github.mercy-preview+json"
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

  getMarkedRepos() {}

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
        update: repo.updated_at,
        hasPages: repo.has_pages,
        hasIssues: repo.has_issues
      };
    });
  }
}

let userGH = new GhPort("tylorkolbeck");

userGH
  // getAllRepos([filter[, order[, formatted]]])
  .getAllRepos("created", null, false)
  .then(res =>
    fs.writeFile("reposFormatted.json", JSON.stringify(res, null, " "), err =>
      console.log(err)
    )
  )
  .catch(err => console.log(err));
