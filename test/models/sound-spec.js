import expect from 'expect';

import { SoundModelFac } from 'test/factories';
import schema from 'app/store/schema';

describe('Model - sound', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('exists', function() {
    expect(SoundModelFac.build()).toExist();
  });
});
