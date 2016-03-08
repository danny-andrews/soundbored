import i from 'icepick';
import { reduce } from 'lodash';
import { handleActions } from 'redux-actions';
import infect from 'infect';

import { Sound } from 'app/models';
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

export const entityMapToOrmData = map =>
  reduce(map, (result, entities, entityType) => {
    entityType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    const idMap = entities.reduce(
      (res, curValue) => i.set(res, curValue.id, curValue),
      {}
    );
    return i.set(result, entityType, {
      itemsById: idMap,
      items: Object.keys(idMap)
    });
  }, {});

export default function(state = INITIAL_STATE, action) {
  const transform = infect.get('ResponseDataTransformer');
  let newState = state;
  const entities = action.response && transform(action.response.data);
  if(entities) {
    newState = i.merge(newState, entityMapToOrmData(entities));
    newState = reduce(newState, (acc, entity, entityType) => {
      acc[entityType] = {
        itemsById: entity.itemsById,
        items: Object.keys(entity.itemsById)
      };
      return acc;
    }, {});
  }

  newState = handleActions({
    [PLAY_SOUND]: playSoundHandler
  })(newState, action);
  return schema.reducer()(newState, action);
}
