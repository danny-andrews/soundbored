import expect from 'expect';

import reducer from 'app/reducers';
import ReducerHelper from 'test/support/reducer-helper';

const subject = ReducerHelper(reducer).reduce;

describe('Reducer - root', function() {
  beforeEach(function() {
    this.newState = subject({}, {});
    this.newStateKeys = Object.keys(this.newState);
  });

  it('includes entities reducer', function() {
    expect(this.newStateKeys.indexOf('entities')).toBeGreaterThan(-1);
  });
});
