import expect from 'expect';

import * as actions from 'app/actions/board';
import * as types from 'app/constants/action-types';

describe('board actions', () => {
  it('#playSound', () => {
    expect(actions.playSound(1)).toEqual({type: types.PLAY_SOUND, id: 1});
  });
});
