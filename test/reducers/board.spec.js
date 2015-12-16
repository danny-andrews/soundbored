import expect from 'expect';

import { playSound } from 'app/actions/board';
import reducer from 'app/reducers/board';

describe('board reducer', () => {
  it('returns initial state', () => {
    let initialState = {sounds: {1: {playCount: 1}}};
    let res = reducer(initialState, playSound(1));
    expect(res).toEqual(initialState);
  });
});
