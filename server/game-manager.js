let uuidv4 = require('uuid/v4');

class GameManager {

  constructor(io) {

    // A system-wide map of online players (UUID mapped to sockets)
    this.players = {};
    io.on('connect', (socket) => this.connect(socket));

  }

  connect(socket) {

    console.log(`A user connected (id = ${socket.id})`);
    socket.on('player:authenticate', (playerId) => this.authenticatePlayer(playerId, socket));
  }

  // Connect (or re-connect) player to server
  authenticatePlayer(socket, playerId) {
    if (playerId && this.players[playerId] !== undefined) {
      this.players[playerId].lastAccessTime = Date.now();
    } else {
      playerId = this.createPlayer();
      socket.emit('player:create', playerId);
    }
  }

  createPlayer() {
    let playerId = uuidv4();
    this.players[playerId] = {
      lastAccessTime: Date.now(),
      name: null
    };
  }

}

module.exports = GameManager;
