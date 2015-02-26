var server = require('http').createServer(handler);
var io = require('socket.io')(server);
var chokidar = require('chokidar');
var serveStatic = require('serve-static');
var finalHandler = require('finalhandler');
var fs = require('fs');

var dataFilename = 'data.txt';
var data = readData();

// Create a static file serving handler which will serve files
// out of the ./public folder
var serveFiles = serveStatic('public');

// The function responsible for handling incoming http requests
function handler(request, response) {
  var done = finalHandler(request, response);

  // Pass handling on to the static file handler, and tell it
  // to run 'done' after it's finished
  serveFiles(request, response, done);
}

// Function which reads the data from the file and returns it as a string
function readData() {
  return fs.readFileSync(dataFilename, 'utf8');
}

// Set up a watcher on the data file
var watcher = chokidar.watch(dataFilename);

// When the file changes
watcher.on('change', function() {
  // Get the new data
  data = readData();

  // Emit a data message to all connected clients with the new data
  io.emit('data', data);
});

// When a client first connects
io.on('connection', function(socket) {
  // Send them the initial message with the current data
  socket.emit('data', data);
});

server.listen(80);
