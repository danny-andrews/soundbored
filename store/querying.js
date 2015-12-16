import assert, { assertAll } from 'arg-assert';
import values from 'lodash/values';

function entityKey(entityType) {
  return `${entityType}s`;
}

function entitiesForType({state, entityType}) {
  return state.entities[entityKey(entityType)];
}

export function getAll({state, entityType}) {
  assert(
    state && state.entities,
    '"state" must be an object with "entities" key'
  );
  assertAll({entityType});
  return values(entitiesForType({state, entityType}));
}

export function get({state, entityType, id}) {
  assert(
    state && state.entities,
    '"state" must be an object with "entities" key'
  );
  assertAll({entityType, id});
  return entitiesForType({state, entityType})[id];
}
