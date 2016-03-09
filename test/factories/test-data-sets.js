import { range, reduce } from 'lodash';
import i from 'icepick';

import { entityMapToOrmData } from 'app/reducers/entities';
import { SHORTCUT_ACTIONS } from 'app/constants';
import config from 'app/util/config';
import * as facs from './';

export const STUB_DATA = {
  Key: facs.KeyFac
    .buildList(25)
    .concat(facs.KeyFac.build({id: 26, shortcuts: [1]})),
  Board: facs.BoardFac.buildList(1, {
    id: 1,
    dj: 1,
    sounds: [range(1, config.get('SOUNDFILES').length)]
  }),
  Sound: config.inDev() ?
    config.get('SOUNDFILES').map((filename, id) =>
      facs.SoundFac.build({
        id: id + 1,
        boards: [1],
        filename,
        displayName: filename.split('.')[0]
      })
    ) :
    facs.SoundFac.buildList(1),
  ShortcutCommand: [
    facs.ShortcutCommandFac.build({
      id: 1,
      shortcuts: [],
      name: SHORTCUT_ACTIONS.PLAY_SOUND
    }),
    facs.ShortcutCommandFac.build({
      id: 2,
      shortcuts: [1],
      name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS
    })
  ],
  Session: facs.SessionFac.buildList(1)
};

export const INITIAL_STORE_DATA = {
  Board: [],
  Config: facs.ConfigFac.buildList(1, {id: 1, dj: 1, shortcuts: [1]}),
  DJ: facs.DjFac.buildList(1, {id: 1, boards: [1], config: 1}),
  Key: [],
  Shortcut: facs.ShortcutFac.buildList(1, {
    id: 1,
    config: 1,
    key: 1,
    shortcutCommand: 2
  }),
  ShortcutCommand: [],
  Sound: [],
  Session: []
};

const setFetched = ormData => reduce(
  ormData,
  (acc, entities, entityType) => {
    if(entities.items.length > 0) {
      acc[entityType] = i.assign(entities, {haveBeenFetched: true});
    }
    else {
      acc[entityType] = entities;
    }
    return acc;
  },
  {}
);

export const entityFac =
  entityData => setFetched(entityMapToOrmData(entityData));

export const DEMO_ENTITIES = setFetched(entityMapToOrmData(INITIAL_STORE_DATA));
