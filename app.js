var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  Twitter = require('node-tweet-stream'),
  // config = require('./config/config.js'),
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


// set variable for tracked location
var currLoc;


// // turn on the socket
// io.sockets.on('connection', function (socket) {
//   console.log('connected');
// });

// T.on('tweet', function (tweet) {
//   console.log('tweet received', tweet);
//   io.sockets.emit('stream', tweet);
// });


// root route automatically tracks tweets from currLoc
// initial currLoc is user's defaultLoc if logged in
// opens up stream with Twitter
app.get('/', function(req, res) {

  if (!req.user) {
    currLoc = 'San Francisco';
  }
  else {
    currLoc = req.user.defaultLoc;
  }

  // console.log('tracking:', currLoc);
  // T.track(currLoc);
 
  res.render('site/index', {location: currLoc,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});


// connect to socket // pass sample tweets to client side
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


// when user searches a new loc
// currLoc becomes prevLoc; currLoc set to new (searched) loc
// untrack prevLoc & start tracking currLoc
app.post('/search', function(req, res) {
  var location = req.body.location;
  currLoc = location;
  res.render('site/index', {location: location, isAuthenticated: req.isAuthenticated(),
    user: req.user});
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




