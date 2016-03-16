import expect from 'expect';

import { KeyModelFac } from 'test/factories';
import schema from 'app/store/schema';

describe('Model - key', function() {
  describe('#displayCode', function() {
    beforeEach(function() {
      const state = schema.getDefaultState();
      schema.withMutations(state);
    });

    it('formats keycode to human-readable key', function() {
      const key = KeyModelFac.build({code: 'KeyA'});
      expect(key.displayCode()).toBe('Key A');
    });
  });
});
