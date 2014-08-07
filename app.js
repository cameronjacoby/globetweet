var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  Twitter = require('node-tweet-stream'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  flash = require('connect-flash'),
  db = require('./models/index'),
  tweets = require('./tweets.json');


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieSession({
  secret: 'thisismysecretkey', // generate a random hash
  name: 'cookie created by cameron',
  // keep user logged in for one week
  maxage: 604800000
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// prepare serialize (grab user id)
passport.serializeUser(function(user, done) {
  console.log('serialize just ran');
  done(null, user.id);
});


// deserialize (check if user id is in the db)
passport.deserializeUser(function(id, done) {
  console.log('deserialize just ran');
  db.user.find({
    where: {
      id: id
    }
  }).done(function(error, user) {
    done(error, user);
  });
});


// set up Twitter keys
var T = new Twitter({
  consumer_key: process.env.TWIITER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  token: process.env.TWITTER_TOKEN,
  token_secret: process.env.TWITTER_TOKEN_SECRET
});


// set variable for searched keyword
var searchKey;


// // turn on the socket
// io.sockets.on('connection', function (socket) {
//   console.log('connected');
// });

// T.on('tweet', function (tweet) {
//   console.log('tweet received', tweet);
//   io.sockets.emit('stream', tweet);
// });


// root route automatically tracks tweets from searchKey
// initial searchKey is user's defaultLoc if logged in
app.get('/', function(req, res) {

  if (!req.user) {
    searchKey = 'San Francisco';
  }
  else {
    searchKey = req.user.defaultLoc;
  }

  // console.log('tracking:', searchKey);
  // T.track(searchKey);
 
  res.render('site/index', {searchKey: searchKey,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});


// connect to socket
// pass sample tweets to client side
io.on('connection', function(socket) {
  console.log('a user connected');

  // connect to twitter api here -->
    io.sockets.emit('receive_tweets', tweets);
    console.log(tweets);
  //////

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


// when user searches new keyword
// set searchKey to new keyword
app.post('/search', function(req, res) {

  var keyword = req.body.keyword;
  searchKey = keyword;

  res.render('site/index', {searchKey: searchKey,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});


app.get('/signup', function(req, res) {
  if (!req.user) {
    res.render('site/signup', {username: '', defaultLoc: ''});
  }
  else {
    res.redirect('/');
  }
});


app.get('/login', function(req, res) {
  if (!req.user) {
    res.render('site/login', {username: '', message: req.flash('loginMessage')});
  }
  else {
    res.redirect('/');
  }
});


app.post('/signup', function(req, res) {
  newUsername = req.body.username;
  newPassword = req.body.password;
  defaultLoc = req.body.defaultLoc;

  db.user.createNewUser(newUsername, newPassword, defaultLoc,
    function(err) {
      res.render('site/signup', {message: err.message, username: newUsername, defaultLoc: defaultLoc});
    },
    function(success) {
      res.render('site/login', {message: success.message, username: newUsername});
    }
  );
});


app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// render 404 page when any other URL attempted
app.get('/*', function(req, res) {
  res.status(404);
  res.render('site/404', {isAuthenticated: req.isAuthenticated(),
    user: req.user});
});


server.listen(process.env.PORT || 3000, function(){
  console.log('server started on localhost:3000');
});




