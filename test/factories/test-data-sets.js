import { reduce } from 'lodash';
import i from 'icepick';

import { SHORTCUT_ACTIONS } from 'app/constants';
import config from 'app/util/config';
import { SoundFac, KeyFac, ShortcutCommandFac, ShortcutFac, ConfigFac, DjFac }
  from './';

const TEST_DATA = {
  configs: ConfigFac.buildList(1, {id: 1, dj_id: 1}),
  djs: DjFac.buildList(1, {id: 1}),
  keys: KeyFac.buildList(26, {id: 1}),
  shortcuts: ShortcutFac.buildList(1, {
    config_id: 1,
    key_id: 1,
    shortcutCommandId: 1
  }),
  shortcutCommands: [
    ShortcutCommandFac.build({id: 1, name: SHORTCUT_ACTIONS.PLAY_SOUND}),
    ShortcutCommandFac.build({name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS})
  ],
  sounds: config.inDev() ?
    config.get('SOUNDFILES').map((filename, id) =>
      SoundFac.build({
        id: id + 1,
        filename,
        displayName: filename.split('.')[0]
      })
    ) :
    []
};

export const TEST_ENTITIES = reduce(TEST_DATA, (result, value, key) =>
  i.set(result, key, value.reduce((res, curValue) =>
    i.set(res, curValue.id, curValue), {})), {});
