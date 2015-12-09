import expect from 'expect';
import reducer from '../../reducers/board';
import * as types from '../../constants/action-types';

describe('board reducer', () => {
  it('returns initial state', () => {
    let res = reducer([], {type: types.PLAY_SOUND, id: 1});
    expect(res).toEqual([]);
  });
});
