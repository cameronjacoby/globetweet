$(function() {

  // render map
  L.mapbox.accessToken = 'pk.eyJ1IjoiY2FtZXJvbmphY29ieSIsImEiOiI1RnVTdEUwIn0.pImMEyK7Ziab2QE7N-TK0A';
  var map = L.mapbox.map('map', 'cameronjacoby.j4l2ebki', {
            center: [0, 0],
            zoom: 2,
            minZoom: 2,
            maxBounds: [[-90, -180], [90, 180]]
  });

  // set variables
  // var socket = io(),
  //     geocoder = L.mapbox.geocoder('mapbox.places-v1'),
  //     tweetCount = 0,
  //     $countMessage = $('#count-message'),
  //     $tweetCount = $('#tweet-count'),
  //     $loadMessage = $('#load-msg'),
  //     $waitMessage = $('#wait-msg'),
  //     $liveTweets = $('#live-tweets');

  // // function to show markers on map
  // var showMarker = function(lng, lat, twitterHandle, tweetText) {
  //   L.mapbox.featureLayer({
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: [lng, lat]
  //     },
  //     properties: {
  //       description: '@' + twitterHandle + ': ' + tweetText,
  //       'marker-size': 'small',
  //       'marker-color': '#fc4607',
  //       'marker-symbol': 'star'
  //     }
  //   }).addTo(map);
  // };

  // // display wait message if no tweets after 15 seconds
  // setTimeout(function() {
  //   if (tweetCount === 0) {
  //     $waitMessage.fadeIn();
  //   }
  // }, 15000);

  // socket.on('receive_tweet', function(tweet) {
  //   $liveTweets.prepend($('<div class="clr"><img src="'
  //     + tweet.user.profile_image_url + '" > <strong>@'
  //     + tweet.user.screen_name + ':</strong> <a href="http://twitter.com/'
  //     + tweet.user.screen_name + '/status/'
  //     + tweet.id_str + '" target="blank">'
  //     + tweet.text + '</a></div>').fadeIn('slow','swing')
  //   );

  //   tweetCount += 1;
  //   $tweetCount.html(tweetCount);

  //   if (tweetCount > 0) {
  //     $loadMessage.hide();
  //     $waitMessage.hide();
  //     $countMessage.show();
  //   }

  //   if (tweet.geo) {
  //     showMarker(tweet.geo.coordinates[1], tweet.geo.coordinates[0], tweet.user.screen_name, tweet.text);
  //   }

  //   else if (tweet.user.location) {
  //     geocoder.query(tweet.user.location, function(err, result) {
  //       if (!err) {
  //         showMarker(result.latlng[1], result.latlng[0], tweet.user.screen_name, tweet.text);
  //       }
  //     });
  //   }

  // });

});