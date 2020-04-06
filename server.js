const express = require("express")
const GhPort = require("./GhPort.js")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()
const port = process.env.PORT

let ghportSettings = {
  format: "raw",
  cache: false,
  token: process.env.USER_TOKEN,
}

let ghport = new GhPort("tylorkolbeck", ghportSettings)

// Get marked repos with descriptions
app.get("/desc", (req, res) => {
  ghport.reposDescription().then((repos) => res.send(repos))
})

// Get marked repos with their contents
app.get("/content", (req, res) => {
  ghport.reposWithContent().then((repos) => res.send(repos))
})

app.get("/req_remaining", (req, res) => {
  res.send(ghport.requestsRemaining)
})

app.get("/state_data", async (req, res) => {
  const data = await getHtml()
  console.log(data)
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

async function getHtml() {
  const url = "https://www.worldometers.info/coronavirus/country/us/"
  const finalArray = []

  await axios(url)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)
      const tableData = $("#usa_table_countries_today tbody:first-of-type")

      let stateColumn = tableData.find("tr > td:first-of-type")
      let deathColumn = tableData.find("tr > td:nth-of-type(2)")

      let stateArray = stateColumn.text().split("\n")
      let deathsArray = []
      deathColumn.each((i, elem) => {
        deathsArray.push($(elem).text())
      })

      stateArray.forEach((el, i) => {
        finalArray.push({
          state: el,
          deaths: deathsArray[i],
        })
      })
    })
    .catch(console.error)
  return finalArray
}
