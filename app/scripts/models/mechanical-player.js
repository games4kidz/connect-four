'use strict';

var Player = require('./player');

// A machine player whose moves are controlled programmatically; it does not
// necessarily make its own decisions; every mechanical player inherits from the
// base Player model
function MechanicalPlayer(args) {
  Player.call(this, args);
}
MechanicalPlayer.prototype = Object.create(Player.prototype);
// MechanicalPlayer is meant to be subclassed, so it doesn't define an explicit
// type; regardless, it's useful to know if a particular player model is
// mechanical
MechanicalPlayer.prototype.isMechanical = true;
// The duration to wait (in milliseconds) between each of the mechanical
// player's movements
MechanicalPlayer.waitDelay = 150;

// Wait for a short moment between each of the mechanical player's movements
MechanicalPlayer.prototype.wait = function (callback) {
  setTimeout(function () {
    callback();
  }, MechanicalPlayer.waitDelay);
};

module.exports = MechanicalPlayer;
