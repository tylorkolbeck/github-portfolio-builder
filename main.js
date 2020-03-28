const fetch = require("node-fetch");

class GhPort {
  constructor(gh_userName) {
    this.gh_userName = gh_userName;
  }

  baseURL = "https://api.github.com";
  user_repos = [];

  getAllRepos(callback) {
    fetch(`${this.baseURL}/users/${this.gh_userName}/repos`)
      .then(res => {
        res.json().then(res => {
          this.__buildRepoList(res);
          callback(this.user_repos, null);
        });
      })
      .catch(err => callback(null, err.message));
  }

  __buildRepoList(reposRaw) {
    reposRaw.forEach(repo => {
      this.user_repos.push({
        id: repo.id,
        name: repo.name,
        url: repo.owner.html_url,
        description: repo.description,
        commits: 0,
        ssh: repo.ssh_url,
        stars: repo.stargazers_count
      });
    });
  }
}

let tylor = new GhPort("tylorkolbeck");
tylor.getAllRepos(logResponse);

function logResponse(res, err) {
  if (!err) {
    console.log(res);
  } else {
    console.log(err);
  }
}
