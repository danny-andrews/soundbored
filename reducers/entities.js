import { assertAll } from 'arg-assert';
import { merge } from 'lodash/merge';
import transform from 'lodash/transform';
import { handleActions } from 'redux-actions';

const INITIAL_STATE = {
  soundIds: [],
  sounds: {},
  boards: {},
  dj: {},
  config: {},
  shortcuts: {},
  keys: {}
};

const ENTITY_MODEL_MAP = {};

function transformEntity({entity, entityType}) {
  assertAll({entity, entityType});
  const klass = ENTITY_MODEL_MAP[entityType];
  return Boolean(klass) ? new klass(entity) : entity;
}

export default function(state = INITIAL_STATE, action) {
  let newState = state;
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

  const actionHandlerRes = handleActions({})(newState, action);

  return actionHandlerRes !== newState ? actionHandlerRes : newState;
}
