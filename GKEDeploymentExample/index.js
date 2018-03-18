var express = require('express')
var app = express()
var path  = require("path");


app.use( express.static( __dirname));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})


app.get('/project', function (req, res) {
  res.send("SYDE 322 is the best x " + likeCount);
})


app.listen(3000, function () {
  console.log('Listening on port 3000');
})
