import expect from 'expect';

import * as facs from 'test/factories';
import schema from 'app/store/schema';

describe('Model - shortcut', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('belongs to a config', function() {
    const config = facs.ConfigModelFac.build({id: 3});
    const shortcut = facs.ShortcutModelFac.build({id: 4, config});
    expect(shortcut.config.equals(config)).toBe(true);
  });

  it('belongs to a key', function() {
    const key = facs.KeyModelFac.build({id: 3});
    const shortcut = facs.ShortcutModelFac.build({id: 4, key});
    expect(shortcut.key.equals(key)).toBe(true);
  });

  it('belongs to a shortcutCommand', function() {
    const shortcutCommand = facs.ShortcutCommandModelFac.build({id: 3});
    const shortcut = facs.ShortcutModelFac.build({id: 4, shortcutCommand});
    expect(shortcut.shortcutCommand.equals(shortcutCommand)).toBe(true);
  });

  it('has one sound', function() {
    const sound = facs.SoundModelFac.build({id: 3});
    const shortcut = facs.ShortcutModelFac.build({id: 4, sound});
    expect(shortcut.sound.equals(sound)).toBe(true);
  });
});
