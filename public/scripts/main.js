
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
  loadMessage = $('#load-msg');

socket.on('receive_tweets', function(tweets) {
  tweets.forEach(function(tweet) {

    tweetArr.push(tweet);

  });
});

setTimeout(function() {

  (function streamTweet() {

    L.mapbox.featureLayer({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          tweetArr[count].coordinates.coordinates[0],
          tweetArr[count].coordinates.coordinates[1]
        ]
      },
      properties: {
        title: 'Peregrine Espresso',
        description: '1718 14th St NW, Washington, DC',
        'marker-size': 'large',
        'marker-color': '#BE9A6B',
        'marker-symbol': 'cafe'
      }
    }).addTo(map);

    tweetDiv.prepend('<div class="clr" id="' + (count) + '"><img src="'
      + tweetArr[count].user.profile_image_url + '" > <strong>'
      + tweetArr[count].user.screen_name + ':</strong> ' + tweetArr[count].text
      + tweetArr[count].coordinates.coordinates[0] + ', '
      + tweetArr[count].coordinates.coordinates[1] + '</div>');

    count += 1;
    counter.html(count);

    if (count > 0) {
      loadMessage.hide();
      tweetCount.show();
    }

    if (count === 20) {
      return;
    }

    setTimeout(streamTweet, 1000);
  })();

}, 2000);



// function showMap(err, data) {
//   var count = 0;
  
//   // var socket = io.connect('http://localhost:3000');
//   // socket.on('stream', function(tweet) {
//   //   count += 1;
//   //   console.log(count);
//   //   $('#tweetd').prepend('<div class="clearfix" id="' + count + '"><img src="' + tweet.user.profile_image_url + '" /><strong>' + tweet.user.screen_name + ':</strong> ' + tweet.text +'</div>');
//   //   $('#counter').html(count);
//   // });

//   // The geocoder can return an area, like a city, or a
//   // point, like an address. Here we handle both cases,
//   // by fitting the map bounds to an area or zooming to a point.
//   if (data.lbounds) {
//     map.fitBounds(data.lbounds);
//     var coord1 = data.lbounds._southWest.lng;
//     var coord2 = data.lbounds._southWest.lat;
//     var coord3 = data.lbounds._northEast.lng;
//     var coord4 = data.lbounds._northEast.lat;
//     console.log('coordinates:');
//     console.log(coord1, coord2, coord3, coord4);

//   } else if (data.latlng) {
//     map.setView([data.latlng[0], data.latlng[1]], 13);
//     console.log('latlng data:');
//     console.log(data.latlng);
//   }

// }

// showMap();




