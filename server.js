var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    Twitter = require('node-tweet-stream');

require('dotenv').load();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// connect to socket
io.on('connection', function (socket) {
  console.log('user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

// set up tweet stream
twitter = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  token: process.env.TWITTER_TOKEN,
  token_secret: process.env.TWITTER_TOKEN_SECRET
});

// stream tweets
twitter.on('tweet', function (tweet) {
  console.log('tweet received', tweet);
  io.sockets.emit('receive_tweet', tweet);
});

// set variable for search keyword
var searchKey;

// root route automatically tracks tweets from `searchKey`
// initial `searchKey` is user's `defaultSearch` if logged in
app.get('/', function (req, res) {
  twitter.untrack(searchKey);
  console.log('untracking', searchKey);

  searchKey = 'San Francisco';
  twitter.track(searchKey);
  console.log('tracking', searchKey);
 
  res.render('site/index', { searchKey: searchKey });
});

// when user searches new keyword, set `searchKey`
app.post('/search', function (req, res) {
  twitter.untrack(searchKey);
  console.log('untracking', searchKey);

  var newKeyword = req.body.keyword;
  searchKey = newKeyword;
  console.log('new searchKey', searchKey);

  twitter.track(searchKey);
  console.log('tracking', searchKey);

  res.render('site/index', { searchKey: searchKey });
});

server.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});