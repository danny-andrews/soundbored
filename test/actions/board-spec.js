import expect from 'expect';

import { playSound, killAllSounds } from 'app/actions';
import { PLAY_SOUND, KILL_ALL_SOUNDS } from 'app/constants';

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
});
