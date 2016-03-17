import expect from 'expect';

import * as facs from 'test/factories';
import schema from 'app/store/schema';

describe('Model - shortcut', function() {
  beforeEach(function() {
    this.state = schema.getDefaultState();
    schema.withMutations(this.state);
  });

  it('belongs to a config', function() {
    const config = facs.ConfigModelFac.build();
    const shortcut = facs.ShortcutModelFac.build({config});
    expect(shortcut.config.equals(config)).toBe(true);
  });

  it('belongs to a key', function() {
    const key = facs.KeyModelFac.build();
    const shortcut = facs.ShortcutModelFac.build({key});
    expect(shortcut.key.equals(key)).toBe(true);
  });

  it('belongs to a shortcutCommand', function() {
    const shortcutCommand = facs.ShortcutCommandModelFac.build();
    const shortcut = facs.ShortcutModelFac.build({shortcutCommand});
    expect(shortcut.shortcutCommand.equals(shortcutCommand)).toBe(true);
  });

  it('has one sound', function() {
    const sound = facs.SoundModelFac.build();
    const shortcut = facs.ShortcutModelFac.build({sound});
    expect(shortcut.sound.equals(sound)).toBe(true);
  });
});
