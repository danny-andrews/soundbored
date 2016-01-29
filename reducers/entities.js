import i from 'icepick';
import { transform, cloneDeep, uniq } from 'lodash';
import { handleActions } from 'redux-actions';

import { Sound } from 'app/models';
import schema from 'app/store/schema';
import { PLAY_SOUND } from 'app/constants';

const INITIAL_STATE = {
  soundIds: [],
  Board: {
    itemsById: {},
    items: []
  },
  Config: {},
  DJ: {
    itemsById: {},
    items: []
  },
  Key: {},
  Shortcut: {},
  ShortcutCommand: {},
  Sound: {}
};

function playSoundHandler(state, action) {
  const id = action.payload;
  const sound = Sound.withId(id);
  sound.update({playCount: sound.playCount + 1});
  return i.merge(state, {Sound: Sound.getNextState()});
}

export default function(state = INITIAL_STATE, action) {
  let newState = cloneDeep(state);
  const entities = action.response && action.response.entities;
  if(entities) {
    newState = transform(entities, (modEntities, idMap, entityType) =>
      modEntities[entityType] = {
        itemsById: i.merge(newState[entityType].itemsById, idMap),
        items: uniq(Object.keys(idMap).concat(newState[entityType].items))
      }
    );
  }

  newState = handleActions({
    [PLAY_SOUND]: playSoundHandler
  })(newState, action);
  return schema.reducer()(newState, action);
}
