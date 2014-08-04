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
  res.render('site/index', {location: ''});
});


var T = new Twit({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

var coord1 = '-122.75';
var coord2 = '36.8';
var coord3 = '-121.75';
var coord4 = '37.8';
var loc = [coord1, coord2, coord3, coord4];

io.sockets.on('connection', function (socket) {
  console.log('Connected');

  var stream = T.stream('statuses/filter', {locations: loc});

  stream.on('tweet', function (tweet) {
    io.sockets.emit('stream', tweet.text);
  });
});


app.post('/search', function(req, res) {
  var location = req.body.location;
  console.log(location);
  res.render('site/index', {location: location});
});


app.get('/*', function(req, res) {
  res.status(404);
  res.render('site/404');
});




