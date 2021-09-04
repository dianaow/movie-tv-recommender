// load all env variables from .env file into process.env object.
require(‘dotenv’).config()

const express = require("express")
const cors = require('cors')
const path = require("path")

const app = express()
app.use(cors())
const PORT = process.env.PORT || 8080

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'dianaow',
  host: 'localhost',
  database: 'test',
  //password: 'password',
  port: 5432,
})


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )

  next()
})

app.get('/similarity', (req, res) => {

  const title = req.query.title

  pool.query('SELECT * FROM results WHERE search_title = $1', [title], (error, results) => {
    if (error) {
      throw error
    }
    res.send(results.rows)
  })

})

app.get('/title', (req, res) => {

  const title = req.query.title

  pool.query('SELECT * FROM titles WHERE title = $1', [title], (error, results) => {
    if (error) {
      throw error
    }
    res.send(results.rows)
  })

})

app.use(express.static(path.join(__dirname, "")))

app.listen(PORT, "0.0.0.0", function onStart(err) {
  if (err) {
    console.log(err)
  }
  console.info(
    "==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.",
    PORT,
    PORT
  )
})

