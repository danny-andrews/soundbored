import { createSelector, defaultMemoize } from 'reselect';
import { reduce } from 'lodash';

import { SHORTCUT_ACTIONS } from 'app/constants';
import config from 'app/util/config';
import SoundPlayerFactory from 'app/util/sound-player-factory';
import schema from 'app/store/schema';

function soundPath(filename) {
  return [config.get('ASSET_PATH'), 'sounds', filename].join('/');
}

export const session = schema.createSelector(session =>
  session.Session.all().toModelArray()[0]
);

export const sounds = schema.createSelector(session =>
  session.Sound.all()
);

export const boards = schema.createSelector(session =>
  session.Board.all()
);

export const keys = schema.createSelector(session =>
  session.Key.all()
);

export const shortcuts = schema.createSelector(session =>
  session.Shortcut.all()
);

export const shortcutCommands = schema.createSelector(session =>
  session.ShortcutCommand.all()
);

const soundRefs = createSelector(sounds, sounds => sounds.toRefArray());

export const soundPlayers = createSelector(
  soundRefs,
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
