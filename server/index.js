let express = require('express');
let socketio = require('socket.io');
let http = require('http');

let GameManager = require('./game-manager.js');

let app = express();
app.use(express.static('public'));

let server = http.createServer(app);
let io = socketio(server);
let gameManager = new GameManager(io);

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
