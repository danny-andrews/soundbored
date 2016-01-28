import expect from 'expect';

import subject from 'app/reducers/previous-action';
import { ActionFac } from 'test/factories/';

describe('Reducer - previous-action', function() {
  beforeEach(function() {
    this.action = ActionFac.build();
  });

  it('uses default state value when state is falsy', function() {
    expect(subject(undefined, this.action)).toBe(this.action);
  });

  it('returns new state with previousAction set to action raised', function() {
    const oldAction = ActionFac.build();
    expect(subject(oldAction, this.action)).toBe(this.action);
  });
});
