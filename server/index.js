let express = require('express');
let socketio = require('socket.io');
let http = require('http');

let app = express();
app.use(express.static('public'));

let server = http.createServer(app);
let io = socketio(server);
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
