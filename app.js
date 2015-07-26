var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    session = require('cookie-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    db = require('./models/index'),
    io = require('socket.io').listen(server),
    Twitter = require('node-tweet-stream');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'thisismysecretkey',
  name: 'cookie created by globetweet',
  maxage: 604800000 // keep user logged in for one week
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare serialize (grab user id)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize (check if user is in db)
passport.deserializeUser(function(id, done) {
  db.user.find({
    where: {
      id: id
    }
  }).done(function(error, user) {
    done(error, user);
  });
});

// connect to socket
io.on('connection', function(socket) {
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
app.get('/', function(req, res) {
  twitter.untrack(searchKey);
  console.log('untracking', searchKey);

  if (req.user) {
    searchKey = req.user.defaultSearch;
  }
  else {
    searchKey = 'San Francisco';
  }
  console.log('new searchKey', searchKey);

  twitter.track(searchKey);
  console.log('tracking', searchKey);
 
  res.render('site/index', {
    searchKey: searchKey,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

// when user searches new keyword, set `searchKey`
app.post('/search', function(req, res) {
  twitter.untrack(searchKey);
  console.log('untracking', searchKey);

  var newKeyword = req.body.keyword;
  searchKey = newKeyword;
  console.log('new searchKey', searchKey);

  twitter.track(searchKey);
  console.log('tracking', searchKey);

  res.render('site/index', {
    searchKey: searchKey,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

app.post('/signup', function(req, res) {
  newUsername = req.body.username;
  newPassword = req.body.password;
  newDefaultSearch = req.body.defaultSearch;

  db.user.createNewUser(newUsername, newPassword, newDefaultSearch,
    function(err) {
      console.log('error', err.message);
      res.redirect('/');
    },
    function(success) {
      console.log('success', success.message);
      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    }
  );
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

server.listen(process.env.PORT || 3000, function(){
  console.log('server started');
});