L.mapbox.accessToken = 'pk.eyJ1IjoiY2FtZXJvbmphY29ieSIsImEiOiI1RnVTdEUwIn0.pImMEyK7Ziab2QE7N-TK0A';
var geocoder = L.mapbox.geocoder('mapbox.places-v1'),
  map = L.mapbox.map('map', 'cameronjacoby.j4l2ebki');

function showMap(err, data) {
  
  var socket = io.connect('http://localhost:3000');
    socket.on('stream', function(tweet) {
    $('#tweetd').append('<p><img src="' + tweet.user.profile_image_url + '" />' + tweet.user.screen_name + ': ' + tweet.text +'<p>');
  });

  // The geocoder can return an area, like a city, or a
  // point, like an address. Here we handle both cases,
  // by fitting the map bounds to an area or zooming to a point.
  if (data.lbounds) {
    map.fitBounds(data.lbounds);
    var coord1 = data.lbounds._southWest.lng;
    var coord2 = data.lbounds._southWest.lat;
    var coord3 = data.lbounds._northEast.lng;
    var coord4 = data.lbounds._northEast.lat;
    console.log('coordinates:');
    console.log(coord1, coord2, coord3, coord4);

  } else if (data.latlng) {
    map.setView([data.latlng[0], data.latlng[1]], 13);
    console.log('latlng data:');
    console.log(data.latlng);
  }

}