import expect from 'expect';

import { DjModelFac, ConfigModelFac } from 'test/factories';
import schema from 'app/store/schema';

describe('Model - config', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('has one dj', function() {
    const dj = DjModelFac.build();
    const config = ConfigModelFac.build({dj});
    expect(config.dj.equals(dj)).toBe(true);
  });
});
