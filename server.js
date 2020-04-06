const express = require("express")
const GhPort = require("./GhPort.js")
const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

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
  let writeString = `${Date.now()} \n`
  const data = await getHtml()
  fs.writeFile("./logs/logs.txt", writeString, (err) => console.log(err))
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
      let casesColumn = tableData.find("tr > td:nth-of-type(2)")
      let deathColumn = tableData.find("tr > td:nth-of-type(4)")
      let activeCasesColumn = tableData.find("tr > td:nth-of-type(6)")
      let testsColumn = tableData.find("tr > td:nth-of-type(9)")

      let stateArray = stateColumn.text().split("\n")
      let casesArray = []
      let deathsArray = []
      let activeCasesArray = []
      let testsArray = []

      casesColumn.each((i, elem) => {
        casesArray.push($(elem).text())
      })

      deathColumn.each((i, elem) => {
        deathsArray.push($(elem).text())
      })

      activeCasesColumn.each((i, elem) => {
        activeCasesArray.push($(elem).text())
      })

      testsColumn.each((el, elem) => {
        testsArray.push($(elem).text())
      })

      stateArray.forEach((el, i) => {
        finalArray.push({
          state: el.trim(),
          cases: casesArray[i].trim(),
          deaths: deathsArray[i].replace("\n", "").trim(),
          activeCases: activeCasesArray[i].trim(),
          tests: testsArray[i].replace("\n", "").trim(),
        })
      })
    })
    .catch(console.error)
  return finalArray
}
