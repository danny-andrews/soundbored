import i from 'icepick';
import { transform, cloneDeep, uniq, reduce } from 'lodash';
import { handleActions } from 'redux-actions';

import { Sound } from 'app/models';
import { extractEntities } from 'app/util/json-api-helpers';
import schema from 'app/store/schema';
import { PLAY_SOUND } from 'app/constants';

const INITIAL_STATE = reduce([
    'Board',
    'Config',
    'DJ',
    'Key',
    'Shortcut',
    'ShortcutCommand',
    'Sound',
    'Session'
  ],
  (acc, entityType) => {
    acc[entityType] = {itemsById: {}, items: []};
    return acc;
  },
  {}
);

function playSoundHandler(state, action) {
  const id = action.payload;
  const sound = Sound.withId(id);
  sound.update({playCount: sound.playCount + 1});
  return i.merge(state, {Sound: Sound.getNextState()});
}

export default function(state = INITIAL_STATE, action) {
  let newState = cloneDeep(state);
  const entities = action.response && extractEntities(action.response.data);
  if(entities) {
    const newItems = transform(entities, (modEntities, idMap, entityType) => {
      entityType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
      return modEntities[entityType] = {
        itemsById: i.merge(newState[entityType].itemsById, idMap),
        items: uniq(Object.keys(idMap).concat(newState[entityType].items))
      };
    });
    newState = i.merge(newState, newItems);
  }

  newState = handleActions({
    [PLAY_SOUND]: playSoundHandler
  })(newState, action);
  return schema.reducer()(newState, action);
}
