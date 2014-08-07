
// render map
L.mapbox.accessToken = 'pk.eyJ1IjoiY2FtZXJvbmphY29ieSIsImEiOiI1RnVTdEUwIn0.pImMEyK7Ziab2QE7N-TK0A';
var map = L.mapbox.map('map', 'cameronjacoby.j4l2ebki')
  .setView([0, 0], 2);


// receive data from socket
var socket = io(),
  tweetArr = [];
  tweetDiv = $('#tweetd'),
  count = 0,
  counter = $('#counter'),
  tweetCount = $('#tweet-count'),
  loadMessage = $('#load-msg'),


socket.on('receive_tweets', function(tweets) {
  tweets.forEach(function(tweet) {

    tweetArr.push(tweet);

  });
}); // add callback here instead of setTimeout below

// coordinates: [
//   tweetArr[count].geo.coordinates[1],
//   tweetArr[count].geo.coordinates[0]
// ]

setTimeout(function() {
  var lng;
  var lat;

  (function streamTweet() {

    if (tweetArr[count].geo) {
      lng = tweetArr[count].geo.coordinates[1];
      lat = tweetArr[count].geo.coordinates[0];
      console.log('COORDINATES!!!');
    } else {
      lng = 0;
      lat = -50;
      console.log('NULL!!!');
    }

    if (tweetArr[count].place) {
      console.log(tweetArr[count].place);
    }

    L.mapbox.featureLayer({
      type: 'Feature',
      geometry: {
        type: 'Point',

        coordinates: [
          lng,
          lat
        ]
          // tweetArr[count].coordinates.coordinates[0],
          // tweetArr[count].coordinates.coordinates[1]
      },
      properties: {
        title: tweetArr[count].user.screen_name,
        // change to name of place
        description: tweetArr[count].text,
        'marker-size': 'medium',
        'marker-color': '#FC4607',
        'marker-symbol': 'star'
      }
    }).addTo(map);

    tweetDiv.prepend('<div class="clr"><img src="'
      + tweetArr[count].user.profile_image_url + '" > <strong>'
      + tweetArr[count].user.screen_name + ':</strong> <a href="http://twitter.com/'
      + tweetArr[count].user.screen_name + '/status/'
      + tweetArr[count].id_str + '" target="blank">'
      + tweetArr[count].text + '</a></div>');

    count += 1;
    counter.html(count);

    if (count > 0) {
      loadMessage.hide();
      tweetCount.show();
    }

    if (count === 100) {
      return;
    }

    setTimeout(streamTweet, 1000);
  })();

}, 2000);




