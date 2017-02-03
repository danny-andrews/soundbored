import {ConfigModelFac, DjModelFac} from 'test/factories';
import expect from 'expect';
import schema from 'app/store/schema';

describe('Model - dj', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('has one config', function() {
    const dj = DjModelFac.build();
    const config = ConfigModelFac.build({dj});
    expect(dj.config.equals(config)).toBe(true);
  });
});
