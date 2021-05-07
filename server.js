const express = require('express')
const serveStatic = require('serve-static')
const cors = require("cors");
const path = require('path')

const app = express()

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))
app.use(cors());

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})

console.log("API URL", process.env.API_URL)
console.log(__dirname)
const port = process.env.PORT || 8080
app.listen(port)
console.log(`app is listening on port: ${port}`)