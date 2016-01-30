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

// root route automatically tracks tweets from `searchKey`
// default is 'San Francisco'
app.get('/', function (req, res) {
  twitter.untrack(req.searchKey);
  console.log('untracking', req.searchKey);

  req.searchKey = 'San Francisco';
  twitter.track(req.searchKey);
  console.log('tracking', req.searchKey);
 
  res.render('site/index', { searchKey: req.searchKey });
});

// when user searches new keyword, update `searchKey`
app.post('/search', function (req, res) {
  twitter.untrack(req.searchKey);
  console.log('untracking', req.searchKey);

  req.searchKey = req.body.keyword;
  twitter.track(req.searchKey);
  console.log('tracking', req.searchKey);

  res.render('site/index', { searchKey: req.searchKey });
});

server.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});