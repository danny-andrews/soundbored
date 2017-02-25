import {chain, difference} from 'lodash';
import {fk, Model, oneToOne} from 'redux-orm';
import {ASSIGN_SHORTCUT_KEYS} from 'app/constants/action-types';
import {handleActions} from 'redux-actions';
import {SHORTCUT_ACTIONS, DEFAULT_ENTITY_STATE} from 'app/constants';

// TODO: Move this logic to the backend.
function assignShortcutKeysHandler(session) {
  const playSoundCommandId = session.ShortcutCommand.get({
    name: SHORTCUT_ACTIONS.PLAY_SOUND
  }).id;
  const killSoundsCommandId = session.ShortcutCommand.get({
    name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS
  }).id;
  session.Shortcut.create({
    key: '1',
    shortcutCommand: killSoundsCommandId
  });
  const totalKeys = session.Key.withRefs.map(key => key.id);
  const usedKeys = session.Shortcut.withRefs.map(sc => sc.keyId).concat('1');
  const freeKeys = difference(totalKeys, usedKeys);
  const totalSoundIds = session.Sound.withRefs.map(sound => sound.id);
  const usedSoundIds = chain(session.Shortcut.withRefs)
    .map(sc => sc.soundId)
    .compact()
    .value();
  const freeSoundIds = difference(totalSoundIds, usedSoundIds);
  chain(freeSoundIds)
    .zip(freeKeys)
    .slice(0, Math.min(freeSoundIds.length, freeKeys.length))
    .value()
    .forEach(pair =>
      session.Shortcut.create({
        key: pair[1],
        shortcutCommand: playSoundCommandId,
        sound: pair[0]
      })
    );
}

export class Shortcut extends Model {
  static reducer(state = DEFAULT_ENTITY_STATE, action, klass, session) {
    handleActions({
      [ASSIGN_SHORTCUT_KEYS]: () => assignShortcutKeysHandler(session)
    }, state)(state, action);

    return klass.getNextState();
  }
}
Shortcut.modelName = 'Shortcut';
Shortcut.fields = {
  config: fk('Config', 'shortcuts'),
  key: fk('Key', 'shortcuts'),
  shortcutCommand: fk('ShortcutCommand', 'shortcuts'),
  sound: oneToOne('Sound', 'shortcut')
};
