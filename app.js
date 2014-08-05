var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  Twitter = require('node-tweet-stream'),
  io = require('socket.io').listen(server),
  config = require('./config/config.js');

server.listen(3000, function(){
  console.log('server started on localhost:3000');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


var T = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  token: config.twitter.access_token,
  token_secret: config.twitter.access_token_secret
});


io.sockets.on('connection', function (socket) {
  console.log('connected');
});


app.get('/', function(req, res) {
  T.track('San Francisco');
  T.on('tweet', function (tweet) {
    console.log('tweet received', tweet);
    io.sockets.emit('stream', tweet);
  });
  res.render('site/index', {location: 'San Francisco'});
});


app.post('/search', function(req, res) {
  var location = req.body.location;
  console.log(location);
  T.untrack('San Francisco');
  T.track(location);
  res.render('site/index', {location: location});
});


app.get('/*', function(req, res) {
  res.status(404);
  res.render('site/404');
});




