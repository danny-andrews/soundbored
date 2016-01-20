import { assertAll } from 'arg-assert';
import { values, merge } from 'lodash';

function entityKey(entityType) {
  return `${entityType}s`;
}

function entitiesForType({state, entityType}) {
  return state.entities[entityKey(entityType)];
}

export function getAll({state, entityType}) {
  if(Boolean(state.entities)) {
    state = state.entities;
  }
  assertAll({state, entityType});
  return values(entitiesForType({state, entityType}));
}

export function get({state, entityType, id}) {
  if(Boolean(state.entities)) {
    state = state.entities;
  }
  assertAll({state, entityType, id});
  return entitiesForType({state, entityType})[id];
}

export function update({state, entityType, id, newVals}) {
  if(Boolean(state.entities)) {
    state = state.entities;
  }
  assertAll({state, entityType, id, newVals});
  return merge({}, state, {
    [entityType]: {
      [id]: newVals
    }
  });
}
