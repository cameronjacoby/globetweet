
L.mapbox.accessToken = 'pk.eyJ1IjoiY2FtZXJvbmphY29ieSIsImEiOiI1RnVTdEUwIn0.pImMEyK7Ziab2QE7N-TK0A';
var map = L.mapbox.map('map', 'cameronjacoby.j4l2ebki')
  .setView([0, 0], 2);


// receive data from socket
var socket = io(),
  tweetDiv = $('#tweetd'),
  counter = $('#counter'),
  count = 0;

socket.on('receive_tweets', function(tweets) {
  tweets.forEach(function(tweet, index) {
    count += 1;
    counter.html(count);
    tweetDiv.prepend('<div class=clearfix>' + '<img src="'
      + tweet.user.profile_image_url + '" > <strong>'
      + tweet.user.screen_name + ':</strong> ' + tweet.text
      + tweet.coordinates.coordinates[0] + ', '
      + tweet.coordinates.coordinates[1] + '</div>');

    L.mapbox.featureLayer({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          tweet.coordinates.coordinates[0],
          tweet.coordinates.coordinates[1]
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
    setTimeout(function() {
      console.log('hello');
    }, 5000);
  });
});



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




