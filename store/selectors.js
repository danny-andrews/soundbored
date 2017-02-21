import {createSelector, createSelectorCreator, defaultMemoize}
  from 'reselect';
import config from 'app/util/config';
import {reduce} from 'lodash';
import schema from 'app/store/schema';
import {SHORTCUT_ACTIONS} from 'app/constants';
import SoundPlayerFactory from 'app/util/sound-player-factory';

const ormSelector = state => state.entities || state;

export function soundPath(filename) {
  return [config.get('ASSET_PATH'), 'sounds', filename].join('/');
}

export const session = createSelector(
  ormSelector,
  schema.createSelector(sess => sess.Session.all().toModelArray()[0])
);

export const sounds = createSelector(
  ormSelector,
  schema.createSelector(sess => sess.Sound.all())
);

export const boards = createSelector(
  ormSelector,
  schema.createSelector(sess => sess.Board.all())
);

export const keys = createSelector(
  ormSelector,
  schema.createSelector(sess => sess.Key.all())
);

export const shortcuts = createSelector(
  ormSelector,
  schema.createSelector(sess => sess.Shortcut.all())
);

export const shortcutCommands = createSelector(
  ormSelector,
  schema.createSelector(sess => sess.ShortcutCommand.all())
);

const soundRefs = createSelector(sounds, snds => snds.toRefArray());

const soundsByFilenameSelectorCreator = createSelectorCreator(
  defaultMemoize,
  (a, b) =>
    a.length === b.length && a.every((sound, index) =>
      sound.id === b[index].id && sound.filename === b[index].filename
    )
);

export const soundPlayers = soundsByFilenameSelectorCreator(
  soundRefs,
  snds => reduce(snds, (acc, sound) => {
    acc[sound.id] = SoundPlayerFactory(soundPath(sound.filename));

    return acc;
  }, {})
);

export const killSoundsShortcutCommand = createSelector(
  ormSelector,
  schema.createSelector(sess =>
    sess.ShortcutCommand.get({name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS})
  )
);

export const playSoundShortcutCommand = createSelector(
  ormSelector,
  schema.createSelector(sess =>
    sess.ShortcutCommand.get({name: SHORTCUT_ACTIONS.PLAY_SOUND})
  )
);

export const killSoundsShortcut = createSelector(
  shortcuts,
  killSoundsShortcutCommand,
  (shrtcuts, killSoundsCommand) =>
    shrtcuts.filter(sc => sc.shortcutCommand.id === killSoundsCommand.id)
      .first()
);
