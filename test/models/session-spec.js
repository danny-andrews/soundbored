import expect from 'expect';

import schema from 'app/store/schema';
import { SessionModelFac } from 'test/factories';

describe('Model - session', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('exists', function() {
    expect(SessionModelFac.build()).toExist();
  });
});
