'use strict';

var expect = require('chai').expect;
var MechanicalPlayer = require('../app/scripts/models/mechanical-player');

describe('mechanical player', function () {

  it('should initialize', function () {
    var mechanicalPlayer = new MechanicalPlayer({
      name: 'Robo Player',
      color: 'black'
    });
    expect(mechanicalPlayer).to.have.property('name', 'Robo Player');
    expect(mechanicalPlayer).to.have.property('color', 'black');
    expect(mechanicalPlayer).to.have.property('score', 0);
    expect(mechanicalPlayer).to.have.property('isMechanical', true);
  });

});
