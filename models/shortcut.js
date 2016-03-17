// jscs:disable disallowKeywords
import { fk, oneToOne, Model } from 'redux-orm';
import { handleActions } from 'redux-actions';
import { difference, chain } from 'lodash';

import { SHORTCUT_ACTIONS } from 'app/constants';
import { ASSIGN_SHORTCUT_KEYS } from 'app/constants/action-types';

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
  static reducer(state, action, Shortcut, session) {
    handleActions({
      [ASSIGN_SHORTCUT_KEYS]: () => assignShortcutKeysHandler(session)
    })(state, action);

    return Shortcut.getNextState();
  }
}
Shortcut.modelName = 'Shortcut';
Shortcut.fields = {
  config: fk('Config', 'shortcuts'),
  key: fk('Key', 'shortcuts'),
  shortcutCommand: fk('ShortcutCommand', 'shortcuts'),
  sound: oneToOne('Sound', 'shortcut')
};
