import {BoardModelFac, ShortcutModelFac, SoundModelFac} from 'test/factories';
import expect from 'expect';
import schema from 'app/store/schema';

describe('Model - sound', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('has many boards', function() {
    const boards = BoardModelFac.buildList(1);
    const shortcut = ShortcutModelFac.build({boards});
    expect(shortcut.boards[0].equals(boards[0])).toBe(true);
  });

  it('has one-to-one shortcut relationship', function() {
    const sound = SoundModelFac.build();
    const shortcut = ShortcutModelFac.build({sound});
    expect(sound.shortcut.equals(shortcut)).toBe(true);
  });
});
