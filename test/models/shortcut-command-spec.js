import expect from 'expect';
import schema from 'app/store/schema';
import {ShortcutCommandModelFac} from 'test/factories';

describe('Model - shortcutCommand', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('exists', function() {
    expect(ShortcutCommandModelFac.build()).toExist();
  });
});
