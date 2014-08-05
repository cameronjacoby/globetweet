var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  Twitter = require('node-tweet-stream'),
  io = require('socket.io').listen(server),
  config = require('./config/config.js'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  flash = require('connect-flash'),
  db = require('./models/index');


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieSession({
  secret: 'thisismysecretkey', // generate a random hash
  name: 'cookie created by cameron',
  // 6 mins
  maxage: 360000
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// set up Twitter keys
var T = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  token: config.twitter.access_token,
  token_secret: config.twitter.access_token_secret
});


// global variables for search locs
var currLoc = 'San Francisco';
var prevLoc;


// turn on the socket
io.sockets.on('connection', function (socket) {
  console.log('connected');
});


// root route automatically tracks tweets from currLoc
// initial currLoc is hard-coded
// opens up stream with Twitter
// renders index.ejs
app.get('/', function(req, res) {
  T.track(currLoc);
  T.on('tweet', function (tweet) {
    console.log('tweet received', tweet);
    io.sockets.emit('stream', tweet);
  });
  res.render('site/index', {location: 'San Francisco'});
});


// when user searches a new loc
// currLoc becomes prevLoc; currLoc set to new (searched) loc
// untrack prevLoc & start tracking currLoc
// renders index.ejs
app.post('/search', function(req, res) {
  var location = req.body.location;
  console.log(location);
  prevLoc = currLoc;
  currLoc = location;
  T.untrack(prevLoc);
  T.track(currLoc);
  res.render('site/index', {location: location});
});


// render 404 page when any other URL attempted
app.get('/*', function(req, res) {
  res.status(404);
  res.render('site/404');
});


server.listen(3000, function(){
  console.log('server started on localhost:3000');
});




