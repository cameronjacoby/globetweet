var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  OAuth = require('oauth'),
  io = require('socket.io').listen(server),
  db = require('./models/index');


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


// set up oauth
var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);


// set variables for searched keyword and URL
var searchKey;
var searchURL;


// connect to socket
io.on('connection', function(socket) {
  console.log('user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


// root route automatically tracks tweets from searchKey
// initial searchKey is user's defaultLoc if logged in
app.get('/', function(req, res) {

  if (!req.user) {
    searchKey = 'San Francisco';
  }
  else {
    searchKey = req.user.defaultLoc;
  }

  console.log(searchKey);
  searchURL = 'https://api.twitter.com/1.1/search/tweets.json?q=' + searchKey + '&result_type=recent&count=100';
  console.log(searchURL);

  oauth.get(searchURL, null, null, function(e, data, res) {
    var tweets = JSON.parse(data).statuses;
    io.sockets.emit('receive_tweets', tweets);
    // console.log(tweets);
  });
 
  res.render('site/index', {searchKey: searchKey,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});


// when user searches new keyword
// set searchKey to new keyword
app.post('/search', function(req, res) {

  var keyword = req.body.keyword;
  searchKey = keyword;

  searchURL = 'https://api.twitter.com/1.1/search/tweets.json?q=' + searchKey + '&result_type=recent&count=100';
  console.log(searchURL);

  oauth.get(searchURL, null, null, function(e, data, res) {
    var tweets = JSON.parse(data).statuses;
    io.sockets.emit('receive_tweets', tweets);
    // console.log(tweets);
  });

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




