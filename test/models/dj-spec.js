import expect from 'expect';

import { DjModelFac, ConfigModelFac } from 'test/factories';
import schema from 'app/store/schema';

describe('Model - dj', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('has one config', function() {
    const dj = DjModelFac.build({id: 1});
    const config = ConfigModelFac.build({id: 4, dj});
    expect(dj.config.equals(config)).toBe(true);
  });
});
