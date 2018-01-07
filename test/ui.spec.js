import chai from 'chai';
import { expect, Assertion } from 'chai';
import chaiDom from 'chai-dom';
chai.use(chaiDom);
import m from 'mithril';
import GameComponent from '../app/scripts/components/game.js';

describe('game UI', () => {

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  // Wait for the next transition on the given element to complete, timing out
  // and erroring if the transition never completes
  function onPendingChipTransitionEnd() {
    return new Promise((resolve) => {
      let pendingChip = qs('.chip.pending');
      pendingChip.addEventListener('transitionend', function transitionend() {
        pendingChip.removeEventListener('transitionend', transitionend);
        resolve(pendingChip);
      });
    });
  }

  // Simulate a mouse event at the specified coordinates, relative to the given
  // element
  function triggerMouseEvent(elem, eventType, x, y) {
    elem.dispatchEvent(new MouseEvent(eventType, {
      clientX: elem.offsetLeft + x,
      clientY: elem.offsetTop + y
    }));
  }

  // Add syntactic sugar assertion for testing CSS translate values
  Assertion.addMethod('translate', function (expectedX, expectedY) {
    let translate = this._obj.style.transform;
    let actualX = parseFloat(translate.slice(translate.indexOf('(') + 1));
    let actualY = parseFloat(translate.slice(translate.indexOf(',') + 1));
    this.assert(
      actualX === expectedX && actualY === expectedY,
      'expected #{this} to have translate #{exp} but got #{act}',
      'expected #{this} not to have translate #{exp}',
      '(' + [expectedX, expectedY].join(', ') + ')',
      '(' + [actualX, actualY].join(', ') + ')'
    );
  });

  // Minimize the transition duration to speed up tests (interestingly, a
  // duration of 0ms will prevent transitionEnd from firing)
  before(() => {
    let style = document.createElement('style');
    style.innerHTML = '* {transition-duration: 200ms !important;}';
    document.head.appendChild(style);
  });

  beforeEach(() => {
    document.body.appendChild(document.createElement('main'));
    m.mount(qs('main'), GameComponent);
  });

  afterEach(() => {
    m.mount(qs('main'), null);
  });

  it('should mount on main', () => {
    m.mount(qs('main'), null);
    document.body.appendChild(document.createElement('main'));
    require('../app/scripts/main');
    expect(qs('#game')).not.to.be.null;
  });

  it('should render initial buttons', () => {
    let buttons = qsa('#game-dashboard button');
    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('1 Player');
    expect(buttons[1]).to.have.text('2 Players');
  });

  it('should render initial grid', () => {
    let slots = qsa('.empty-chip-slot');
    expect(slots).to.have.length(42);
  });

  it('should ask for starting player in 1-Player mode', () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human');
    expect(buttons[1]).to.have.text('Mr. AI');
  });

  it('should ask for starting player in 2-Player mode', () => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    let buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human 1');
    expect(buttons[1]).to.have.text('Human 2');
  });

  it('should start with Human when chosen in 1-Player mode', () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with AI when chosen in 1-Player mode', () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('black');
  });

  it('should start with Human 1 when chosen in 2-Player mode', () => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with Human 2 when chosen in 2-Player mode', () => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('blue');
  });

  it('should place chip in initial column', (done) => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(0, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 0, 0);
  });

  it('should align chip to clicked column', (done) => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(192, 0);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);

  });

  it('should place chip after aligning', (done) => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(192, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(192, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should signal AI to place chip on its turn', (done) => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    // Human's turn
    onPendingChipTransitionEnd()
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(192, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(192, 384);
        return onPendingChipTransitionEnd();
      })
      .then((pendingChip) => {
        // AI's turn
        expect(pendingChip).to.have.class('black');
        expect(pendingChip).to.have.translate(128, 0);
        return onPendingChipTransitionEnd();
      })
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(128, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should align chip to hovered column', (done) => {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then((pendingChip) => {
        expect(pendingChip).to.have.translate(192, 0);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'mousemove', 192, 0);
  });

});
