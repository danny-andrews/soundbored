import { createSelector, defaultMemoize } from 'reselect';
import { reduce } from 'lodash';

import { SHORTCUT_ACTIONS } from 'app/constants';
import config from 'app/util/config';
import SoundPlayerFactory from 'app/util/sound-player-factory';
import schema from 'app/store/schema';

function soundPath(filename) {
  return [config.get('ASSET_PATH'), 'sounds', filename].join('/');
}

export const sounds = schema.createSelector(session =>
  session.Sound.all().toModelArray()
);

export const shortcuts = schema.createSelector(session =>
  session.Shortcut.all().toModelArray()
);

export const shortcutCommands = schema.createSelector(session =>
  session.shortcutCommands.all().toModelArray()
);

export const soundPlayers = createSelector(
  sounds,
  defaultMemoize(
    sounds => reduce(sounds, (acc, sound) => {
      acc[sound.id] = SoundPlayerFactory(soundPath(sound.filename)).setup();
      return acc;
    }, {}),
    (a, b) =>
      a.every((sound, index) =>
        sound.id === b[index].id && sound.filename === b[index].filename
      )
  )
);

export const killSoundsShortcutCommand = schema.createSelector(session =>
  session.ShortcutCommand.get({name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS})
);

export const killSoundsShortcut = createSelector(
  shortcuts,
  killSoundsShortcutCommand,
  (shortcuts, killSoundsCommand) =>
      shortcuts.filter(sc => sc.shortcutCommand.id === killSoundsCommand.id)[0]
);
