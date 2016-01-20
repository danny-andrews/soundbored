import expect from 'expect';

import { playSound } from 'app/actions';
import { PLAY_SOUND } from 'app/constants';

describe('Actions - board', () => {
  it('#playSound', () => {
    expect(playSound(1)).toEqual({type: PLAY_SOUND, payload: 1});
  });
});
