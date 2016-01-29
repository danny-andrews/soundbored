import { assertAll } from 'arg-assert';
import { merge, transform, cloneDeep } from 'lodash';
import { handleActions } from 'redux-actions';

import { update } from 'app/store/querying';
import { PLAY_SOUND } from 'app/constants';

const INITIAL_STATE = {
  soundIds: [],
  boards: {},
  configs: {},
  djs: {},
  keys: {},
  shortcuts: {},
  shortcutCommands: {},
  sounds: {}
};

const ENTITY_MODEL_MAP = {};

function transformEntity({entity, entityType}) {
  assertAll({entity, entityType});
  const klass = ENTITY_MODEL_MAP[entityType];
  return Boolean(klass) ? new klass(entity) : entity;
}

function playSoundHandler(state, action) {
  const id = action.payload;
  const newPlayCount = state.sounds[id].playCount + 1;
  return update({
    state,
    id,
    entityType: 'sounds',
    newVals: {playCount: newPlayCount}
  });
}

export default function(state = INITIAL_STATE, action) {
  let newState = cloneDeep(state);
  const entities = Boolean(action.response) && action.response.entities;
  if(Boolean(entities)) {
    const transformedEntities =
      transform(entities, (modEntities, idMap, entityType) =>
        modEntities[entityType] = transform(idMap, (modIdMap, entity, id) =>
          modIdMap[id] = transformEntity({entity, entityType})
        )
      );
    newState = merge({}, newState, transformedEntities);
  }

  const actionHandlerRes = handleActions({
    [PLAY_SOUND]: playSoundHandler
  })(newState, action);

  return actionHandlerRes !== newState ? actionHandlerRes : newState;
}
