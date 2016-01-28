import expect from 'expect';

import subject from 'app/reducers';

describe('Reducer - root', function() {
  beforeEach(function() {
    this.newState = subject({}, {});
    this.newStateKeys = Object.keys(this.newState);
  });

  it('includes entities reducer', function() {
    expect(this.newStateKeys).toInclude('entities');
  });

  it('includes previous-action reducer', function() {
    expect(this.newStateKeys).toInclude('previousAction');
  });
});
