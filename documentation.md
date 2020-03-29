# GitHub Portfolio Builder

Tylor Kolbeck | 26 March, 2020 | 1.0.0

An app wrapped around the Github API which used to easily create portfolio cards and portfolio pages on your website. GhPort fetchs a users repos that are marked with a "ghport" topic. Each ghport repo should contain a ghport.md file with its contents written in markdown which can then be easily displayed on a website.

We take care of finding the repos and building the cards and pages so that if you are not a webdeveloper you can easily create a portfolio web site of all your work that you wish to share from github.

All you need to do is give each repo you wish to include in your portfolio a topic of "ghport" and include a ghport.md file.

## Base Class

`GhPort`

Create a GhPort instance by passing it a github username string.
Optionally pass in an GitHub OAUTH token.

Note: OAuth tokens should be treated as a password so use caution to not expose it in a repo or on the client.

## Pubilic Methods

---

### `GhPort.getAllRepos()`

Returns an array of all repos associated with the instance username. Each repo will contain:

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

Note:
`GhPort.getAllRepos()` does not only return ghport marked files or the contents of a ghport.md file if it exists. See `GhPort.buildMarkedRepos()` and `GhPort.getMarkedRepos()` for getting repos that are marked with ghport and that contain a ghport.md file.

_`GhPort.getAllRepos()` may be deprecated in a future release so avoid using it._

---

### `GhPort.buildMarkedRepos()`

Note:
Each repo passed to `buildMarkedRepos()` will make an API call which could quickly max out API calls. Only call this method with an array of marked repos. Marked repos will marked with a ghport topic see `getMarkedRepos()`.

TODO:

- Integrate a markdown parser
- Implement a templating engine
