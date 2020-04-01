# GitHub Portfolio Builder

Tylor Kolbeck | 26 March, 2020 | 1.0.0-beta

## THIS IS STILL A WORK IN PROGRESS

## Future Implementations

Add a templating library to allow returning prebuilt cards and repo content pages.

---

## Description

An app wrapped around the Github API which is used to easily create portfolio cards and portfolio pages on your website. GhPort fetchs a users repos that are marked with a "ghport" topic. Each ghport repo should contain a ghport.md file with its contents written in markdown which can then be easily displayed on a website.

We take care of finding the repos and building the cards and pages so that if you are not a web developer you can easily create a portfolio web site of all your work that you wish to share from github.

All you need to do is give each repo you wish to include in your portfolio a topic of "ghport" and include a ghport.md file.

## To Run

Initialize a GhPort object running on a server. This app is served using an express server.

```
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

```

You can use the built in endpoints for retreiving your github data or create custom ones with the GhPort methods.

```
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
  console.log(`GhPort running on port ${port}`);
});
```

## Endpoints

`localhost:{port}/desc`

Returns each repo marked with ghport topic. Contains repo info but does not contain the ghport.md file contents.

```
[
  {
    "id": {num},
    "name": {string}",
    "url": {string}",
    "description": {string},
    "commits": {num} - not implemented yet. For now will return 0,
    "sshUrl": {string},
    "stars": {num},
    "created": {ISO yyyy-mm-ddT00:00:00.000Z},
    "updated": {ISO datyyyy-mm-ddT00:00:00.000Ze},
    "hasPages": {bool} has a deployed git hub page,
    "hasIssues": {bool} has open issues,
    "topics": [ {array} topics
      "ghport" {string}
    ]
  }
]
```

`localhost:{port}/content`

Returns each repo marked with ghport topic with its ghport.md file contents.

```
[
  {
    "id": {num},
    "name": {string}",
    "url": {string}",
    "description": {string},
    "commits": {num} - not implemented yet. For now will return 0,
    "sshUrl": {string},
    "stars": {num},
    "created": {ISO yyyy-mm-ddT00:00:00.000Z},
    "updated": {ISO datyyyy-mm-ddT00:00:00.000Ze},
    "hasPages": {bool} has a deployed git hub page,
    "hasIssues": {bool} has open issues,
    "topics": [ {array} topics
      "ghport" {string}
    ],
    "content" : {string}
  }
]
```

## Error Logs

View error logs in the log.txt file.

## Base Class

### `GhPort`

Create a GhPort instance by passing it a github username string.
Optionally pass in an GitHub personal access token.

Not passing a personal access token will limit requests to 60 per hour but if you authenticate that number is upped to 5,000.

Note: OAuth tokens should be treated as a password so use caution to not expose it in a repo or on the client.

## Methods

---

### `GhPort.reposContent()`

This method returns a promise which will hold all ghport marked repos along with the contents of the ghport.md file.

_Future implementation: Accept order parameter which tells `ghPortRepos` in which order to return the repos, recent to oldest or visa versa._

---

### `GhPort.reposDescription()`

Returns an array of all repos associated with the GhPort instance username. Each repo will contain:

- id - id
- name - name
- url - html_url
- description - description
- commits(future implementation, for now returns 0) - commits
- ssh url - sshUrl
- starts - stars
- date created - created
- date last updated - updated
- using github pages - hasPages
- if it has issues - hasIssues
- associated topics - topics

Use this returned data to build card elements that show a description and link to the main content of the work.

---

### `GhPort.__getGhFileContents()`

Note:
Each repo passed to `__getGhFileContents()` will make an API call which could quickly max out API calls. Only call this method with an array of marked repos.

Note:
`GhPort.__getGhFileContents()` does not only return ghport marked files or the contents of a ghport.md file if it exists. See `GhPort.reposDescription()` for getting repos that are marked with ghport and that contain a ghport.md file. You will quickly max out your requests if you are passing every user git hub repo to this method.

TODO:

- Integrate a markdown parser
- Implement a templating engine
- Add proxy to show number of API calls to keep track when testing
- handle parameter erros
