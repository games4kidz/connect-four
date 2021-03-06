import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import utils from './utils.js';

import AIPlayer from '../../app/scripts/models/ai-player.js';
import Game from '../../app/scripts/models/game.js';

describe('AI player', function () {

  it('should initialize', function () {
    let aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    expect(aiPlayer).to.have.property('name', 'HAL');
    expect(aiPlayer).to.have.property('color', 'red');
    expect(aiPlayer).to.have.property('score', 0);
    expect(aiPlayer).to.have.property('type', 'ai');
  });

  it('should wait when instructed', function () {
    let aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    let clock = sinon.useFakeTimers();
    let callback = sinon.spy();
    expect(aiPlayer.wait(callback));
    clock.tick(500);
    expect(callback).to.have.been.calledOnce;
    clock.restore();
  });

  it('should wrap around if right side of grid is full', function () {
    let game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      startingPlayer: game.players[1],
      columns: [3, 4, 3, 3, 3, 4, 5, 1, 3, 4, 4, 1, 1, 1, 1, 4, 3, 5, 5, 0, 4, 5, 5, 1, 5, 2, 6, 6, 6, 6, 6, 6]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 2]);
  });

});
