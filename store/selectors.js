import { createSelector, defaultMemoize, createSelectorCreator }
  from 'reselect';
import { reduce } from 'lodash';

import { SHORTCUT_ACTIONS } from 'app/constants';
import config from 'app/util/config';
import SoundPlayerFactory from 'app/util/sound-player-factory';
import schema from 'app/store/schema';

const ormSelector = state => state.entities || state;

export function soundPath(filename) {
  return [config.get('ASSET_PATH'), 'sounds', filename].join('/');
}

export const session = createSelector(
  ormSelector,
  schema.createSelector(session => session.Session.all().toModelArray()[0])
);

export const sounds = createSelector(
  ormSelector,
  schema.createSelector(session => session.Sound.all())
);

export const boards = createSelector(
  ormSelector,
  schema.createSelector(session => session.Board.all())
);

export const keys = createSelector(
  ormSelector,
  schema.createSelector(session => session.Key.all())
);

export const shortcuts = createSelector(
  ormSelector,
  schema.createSelector(session => session.Shortcut.all())
);

export const shortcutCommands = createSelector(
  ormSelector,
  schema.createSelector(session => session.ShortcutCommand.all())
);

const soundRefs = createSelector(sounds, sounds => sounds.toRefArray());

const soundsByFilenameSelectorCreator = createSelectorCreator(
  defaultMemoize,
  (a, b) =>
    a.length === b.length && a.every((sound, index) =>
      sound.id === b[index].id && sound.filename === b[index].filename
    )
);

export const soundPlayers = soundsByFilenameSelectorCreator(
  soundRefs,
  sounds => reduce(sounds, (acc, sound) => {
    acc[sound.id] = SoundPlayerFactory(soundPath(sound.filename));
    return acc;
  }, {})
);

export const killSoundsShortcutCommand = createSelector(
  ormSelector,
  schema.createSelector(session =>
    session.ShortcutCommand.get({name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS})
  )
);

export const playSoundShortcutCommand = createSelector(
  ormSelector,
  schema.createSelector(session =>
    session.ShortcutCommand.get({name: SHORTCUT_ACTIONS.PLAY_SOUND})
  )
);

export const killSoundsShortcut = createSelector(
  shortcuts,
  killSoundsShortcutCommand,
  (shortcuts, killSoundsCommand) =>
    shortcuts.filter(sc => sc.shortcutCommand.id === killSoundsCommand.id)
      .first()
);
