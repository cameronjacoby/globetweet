// render map
L.mapbox.accessToken = 'pk.eyJ1IjoiY2FtZXJvbmphY29ieSIsImEiOiI1RnVTdEUwIn0.pImMEyK7Ziab2QE7N-TK0A';
var map = L.mapbox.map('map', 'cameronjacoby.j4l2ebki', {
  center: [0, 0],
  zoom: 2,
  minZoom: 2,
  maxBounds: [
    [-90, -180],
    [90, 180]
  ]
});


// set variables
var socket = io(),
tweetArr = [],
count = 0,
geocoder = L.mapbox.geocoder('mapbox.places-v1'),
tweetDiv = $('#tweetd'),
counter = $('#counter'),
loadMessage = $('#load-msg'),
tweetCount = $('#tweet-count'),
doneMessage = $('#done-msg');


// function to receive data from socket
var getTweets = function(callback) {
  socket.on('receive_tweets', function(tweets) {
    console.log('socket is connected');
    tweets.forEach(function(tweet) {
      tweetArr.push(tweet);
    });
    console.log(tweetArr);
    callback();
  });
};


// function to show tweets
var showTweets = function() {

  tweetDiv.prepend($('<div class="clr"><img src="'
    + tweetArr[count].user.profile_image_url + '" > <strong>@'
    + tweetArr[count].user.screen_name + ':</strong> <a href="http://twitter.com/'
    + tweetArr[count].user.screen_name + '/status/'
    + tweetArr[count].id_str + '" target="blank">'
    + tweetArr[count].text + '</a></div>').fadeIn('slow','swing'));

  count += 1;
  counter.html(count);

  if (count > 0) {
    loadMessage.hide();
    tweetCount.show();
  }

  if (count === tweetArr.length) {
    doneMessage.show();
    return;
  }
};


// function to show markers on map
var showMarker = function(lng, lat) {
  L.mapbox.featureLayer({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        lng,
        lat
      ]
    },
    properties: {
      description: '@' + tweetArr[count].user.screen_name + ': ' + tweetArr[count].text,
      'marker-size': 'small',
      'marker-color': '#FC4607',
      'marker-symbol': 'star'
    }
  }).addTo(map);
};


// function to stream tweets & place markers
var stream = function() {

  (function streamTweet() {

    if (tweetArr[count].geo) {
      showMarker(tweetArr[count].geo.coordinates[1], tweetArr[count].geo.coordinates[0]);
    }

    else if (tweetArr[count].user.location) {
      geocoder.query(tweetArr[count].user.location, function(err, result) {
        if (err) {
          console.log(err);
        }
        else {
          showMarker(result.latlng[1], result.latlng[0]);
        }
      });
    }

    showTweets();

    setTimeout(streamTweet, 2000);
  })();
};


// call functions
getTweets(stream);




