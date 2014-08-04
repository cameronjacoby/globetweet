var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  Twit = require('twit'),
  io = require('socket.io').listen(server),
  config = require('./config/config.js');

server.listen(3000, function(){
  console.log('server started on localhost:3000');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
  res.render('site/index');
});


app.post('/search', function(req, res) {
  res.render('site/index');
});


app.get('/*', function(req, res) {
  res.render('site/404');
});