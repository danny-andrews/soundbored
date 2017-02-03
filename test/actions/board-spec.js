import {KEY_PRESS, KILL_ALL_SOUNDS, PLAY_SOUND} from 'app/constants';
import {keyPress, killAllSounds, playSound} from 'app/actions';
import expect from 'expect';

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
