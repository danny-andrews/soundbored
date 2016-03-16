import i from 'icepick';
import { reduce } from 'lodash';
import { handleActions } from 'redux-actions';
import infect from 'infect';

import { Sound } from 'app/models';
import schema from 'app/store/schema';
import * as ATS from 'app/constants/action-types';

const INITIAL_STATE = reduce([
    'Board',
    'Config',
    'Dj',
    'Key',
    'Shortcut',
    'ShortcutCommand',
    'Sound',
    'Session'
  ],
  (acc, entityType) => {
    acc[entityType] = {
      itemsById: {},
      items: [],
      haveBeenFetched: false,
      isFetching: false
    };
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

const successHandler = (state, type) =>
  i.merge(state, {[type]: {haveBeenFetched: true, isFetching: false}});

const requestHandler = (state, type) =>
  i.merge(state, {[type]: {isFetching: true}});

const authenticateSuccessHandler = state => successHandler(state, 'Session');
const getBoardsSuccessHandler = state => successHandler(state, 'Board');
const getBoardSoundsSuccessHandler = state => successHandler(state, 'Sound');
const getKeysSuccessHandler = state => successHandler(state, 'Key');
const getShortcutCommandsSuccessHandler =
  state => successHandler(state, 'ShortcutCommand');

const authenticateReqHandler = state => requestHandler(state, 'Session');
const getBoardsReqHandler = state => requestHandler(state, 'Board');
const getBoardSoundsReqHandler = state => requestHandler(state, 'Sound');
const getKeysReqHandler = state => requestHandler(state, 'Key');
const getShortcutCommandsReqHandler =
  state => requestHandler(state, 'ShortcutCommand');

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
      acc = i.set(acc, entityType, entity);
      acc = i.setIn(acc, [entityType, 'items'], Object.keys(entity.itemsById));
      return acc;
    }, {});
  }

  newState = handleActions({
    [ATS.PLAY_SOUND]: playSoundHandler,
    [ATS.AUTHENTICATE_SUCCESS]: authenticateSuccessHandler,
    [ATS.GET_BOARDS_SUCCESS]: getBoardsSuccessHandler,
    [ATS.GET_BOARD_SOUNDS_SUCCESS]: getBoardSoundsSuccessHandler,
    [ATS.GET_KEYS_SUCCESS]: getKeysSuccessHandler,
    [ATS.GET_SHORTCUT_COMMANDS_SUCCESS]: getShortcutCommandsSuccessHandler,
    [ATS.AUTHENTICATE_REQ]: authenticateReqHandler,
    [ATS.GET_BOARDS_REQ]: getBoardsReqHandler,
    [ATS.GET_BOARD_SOUNDS_REQ]: getBoardSoundsReqHandler,
    [ATS.GET_KEYS_REQ]: getKeysReqHandler,
    [ATS.GET_SHORTCUT_COMMANDS_REQ]: getShortcutCommandsReqHandler
  })(newState, action);

  return schema.reducer()(newState, action);
}
