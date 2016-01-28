import expect from 'expect';
import stubber from 'fetch-mock';

import { assetPath } from 'app/util/config';
import { TEST_FILENAME } from 'test/factories/sounds';
import SoundPlayerFactory from 'app/util/sound-player-factory';

describe('AudioContextSoundPlayer', function() {
  beforeEach(function() {
    stubber.mock(new RegExp(TEST_FILENAME), {
      body: window.TEST_GLOBALS.soundReqMockData,
      sendAsJson: false
    });
    const soundPath = assetPath({filename: TEST_FILENAME});
    this.subject = SoundPlayerFactory(soundPath);
  });
  afterEach(function() {
    SoundPlayerFactory.clearCache();
  });

  describe('#setup', function() {
    it('returns promise which resolves to instance', function() {
      return this.subject.setup()
        .then(instance => expect(instance).toBe(this.subject));
    });
  });

  describe('#load', function() {
    it('thows error if called before setup is called', function() {
      expect(() => this.subject.load()).toThrow(/setup.*before.*load/i);
    });

    it('returns a player instance', function() {
      return this.subject.setup()
        .then(soundPlayer => soundPlayer.load())
        .then(player => {
          expect(player.start).toBeA('function');
          expect(player.stop).toBeA('function');
        });
    });
  });

  describe('#stopAll', function() {
    beforeEach(function() {
      return this.subject.setup()
        .then(soundPlayer => this.soundPlayer = soundPlayer);
    });

    it('stops all currently playing sounds', function() {
      return Promise.all([
        this.soundPlayer.load(),
        this.soundPlayer.load(),
        this.soundPlayer.load()
      ]).then(players => {
        const spy0 = expect.spyOn(players[0], 'stop');
        const spy1 = expect.spyOn(players[1], 'stop');
        const spy2 = expect.spyOn(players[2], 'stop');
        players[0].start();
        players[2].start();
        this.soundPlayer.stopAll();
        expect(spy0.calls.length).toBe(1);
        expect(spy1.calls.length).toBe(0);
        expect(spy2).toHaveBeenCalled();
      });
    });
  });
});
