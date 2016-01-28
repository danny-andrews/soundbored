import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import stubber from 'fetch-mock';

import { PLAY_SOUND, KILL_ALL_SOUNDS, INIT } from 'app/constants/action-types';
import SoundPlayer from 'app/components/sound-player';
import Board from 'app/containers/board';
import configreStore from 'app/store/configure-store';
import { SoundFac } from 'test/factories';

describe('Containers - Board', function() {
  beforeEach(function() {
    this.sound1 = SoundFac.build({id: 1, displayName: 'Woof', playCount: 0});
    this.sound4 = SoundFac.build({id: 4, displayName: 'Meow'});
    this.store = configreStore({
      entities: {
        sounds: {
          1: this.sound1,
          4: this.sound4
        }
      }
    });
    stubber.mock(/wow/, {
      body: window.TEST_GLOBALS.soundReqMockData,
      type: 'arrayBuffer'
    });
    this.subject = TestUtils.renderIntoDocument(
      React.createElement(Board, {store: this.store})
    ).getWrappedInstance();
    this.soundPlayers =
      TestUtils.scryRenderedComponentsWithType(this.subject, SoundPlayer);
  });
  afterEach(function() {
    stubber.restore();
  });

  it('renders a SoundPlayer for every sound in the store', function() {
    expect(this.soundPlayers.length).toBe(2);
  });

  context('renders SoundPlayer', function() {
    beforeEach(function() {
      this.props = this.soundPlayers[0].props;
    });

    it('sets props.sound', function() {
      expect(this.props.sound).toEqual(this.sound1);
    });

    it('sets props.playSound', function() {
      const props = this.props;
      return new Promise(resolve => {
        this.store.subscribe(resolve);
        props.playSound(1);
      }).then(() => {
        const newState = this.store.getState();
        expect(newState.entities.sounds[1].playCount).toBe(1);
        expect(newState.previousAction.type).toBe(PLAY_SOUND);
      });
    });

    it('sets props.previousAction', function() {
      expect(this.props.previousAction.type).toEqual(INIT);
    });

    it('sets props.soundPlayer', function() {
      const {soundPlayer} = this.props;
      expect(soundPlayer.setup).toBeA('function');
      expect(soundPlayer.load).toBeA('function');
    });
  });

  context('renders killswitch button', function() {
    beforeEach(function() {
      this.killswitch =
        TestUtils.findRenderedDOMComponentWithClass(this.subject, 'killswitch');
    });

    it('has correct markup', function() {
      expect(this.killswitch.innerHTML).toBe('Killswitch');
    });

    it('raises KILL_ALL_SOUNDS action when clicked', function() {
      const killswitch = this.killswitch;
      return new Promise(resolve => {
        this.store.subscribe(resolve);
        TestUtils.Simulate.click(killswitch);
      }).then(() => {
        const newState = this.store.getState();
        expect(newState.previousAction.type).toBe(KILL_ALL_SOUNDS);
      });
    });
  });
});
