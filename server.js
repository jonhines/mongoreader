const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
var config = require('config')
var db;
var serverPort = config.get("server-port")

// allow parsing of form data
app.use(bodyParser.urlencoded({extended: true}))

// expose public directory for css and js
app.use(express.static('public'))

// parse json in POST/PUT
app.use(bodyParser.json())

// define view extensions
app.set('view engine', 'ejs')


// Setup mongoDB instance and start app on server-port
var mongoDBUrl = config.get("mongo-url");
MongoClient.connect(mongoDBUrl, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(serverPort, () => {
    console.log('listening on ' + serverPort)
  })
})

// Initial fetch for index.ejs
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

// Get ALL quotes
app.get('/quotes', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result)
  })
})

// Get Quotes by name
app.get('/quotes/:name', (req, res) => {
  db.collection('quotes').find({name:req.params.name}).toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result)
  })
})

// Create Quote
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

