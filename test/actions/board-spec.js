import expect from 'expect';

import { playSound, killAllSounds, keyPress } from 'app/actions';
import { PLAY_SOUND, KILL_ALL_SOUNDS, KEY_PRESS } from 'app/constants';

describe('Actions - board', () => {
  describe('#playSound', function() {
    it('returns properly-formed action', () => {
      const {type, payload} = playSound(1);
      expect(type).toEqual(PLAY_SOUND);
      expect(payload).toEqual(1);
    });
  });

  describe('#killAllSounds', function() {
    it('returns properly-formed action', () => {
      const {type} = killAllSounds();
      expect(type).toEqual(KILL_ALL_SOUNDS);
    });
  });

  describe('#keyPress', function() {
    it('returns properly-formed action', () => {
      const {type, payload} = keyPress('KeyA');
      expect(type).toEqual(KEY_PRESS);
      expect(payload).toEqual('KeyA');
    });
  });
});
