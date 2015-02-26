// Connect to the websocket server
var socket = io();

var container = document.getElementById('data-container');

// Whenever the server sends us an update message
socket.on('data', function(data) {
  // Set the text of the container to the data we've just received
  container.innerText = data;
});
