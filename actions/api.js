import { createAction } from 'redux-actions';
import assert, { assertAll } from 'arg-assert';
import { createSelector } from 'reselect';
import { chain } from 'lodash';

import * as selectors from 'app/store/selectors';
import { CALL_API } from 'app/middleware/api';
import * as ATS from 'app/constants/action-types';

const getToken = createSelector(
  state => chain(state.entities.Session.itemsById).values().first().value(),
  session => session && session.token
);

const login = createAction(ATS.AUTHENTICATE_REQ, spec => {
  const {auid, name} = spec;
  assertAll({auid, name});
  return {
    [CALL_API]: {
      types: {
        successType: ATS.AUTHENTICATE_SUCCESS,
        failureType: ATS.AUTHENTICATE_FAILURE
      },
      url: '/login',
      type: 'json',
      method: 'POST',
      headers: {'Content-Type': 'application/vnd.api+json'},
      body: {auid, name}
    }
  };
});

export const authenticate = spec =>
  (dispatch, getState) => {
    if(getToken(getState())) {
      return null;
    }
    else {
      return dispatch(login(spec));
    }
  };

const fetchBoards = () =>
  (dispatch, getState) => {
    const token = getToken(getState());
    assert(token, 'Api token must be present. Have you authenticated?');
    return dispatch(createAction(ATS.GET_BOARDS_REQ)({
      [CALL_API]: {
        types: {
          successType: ATS.GET_BOARDS_SUCCESS,
          failureType: ATS.GET_BOARDS_FAILURE
        },
        url: '/boards',
        type: 'json',
        headers: {Bearer: token, 'Content-Type': 'application/vnd.api+json'},
        method: 'GET'
      }
    }));
  };

let fetchingBoards = false;
export const loadBoards = () =>
  (dispatch, getState) => {
    const boards = selectors.boards(getState().entities).toRefArray();
    if(boards.length > 0 || fetchingBoards) {
      return null;
    }
    else {
      fetchingBoards = true;
      return dispatch(fetchBoards());
    }
  };

const fetchKeys = () =>
  (dispatch, getState) => {
    const token = getToken(getState());
    assert(token, 'Api token must be present. Have you authenticated?');
    return dispatch(createAction(ATS.GET_KEYS_REQ)({
      [CALL_API]: {
        types: {
          successType: ATS.GET_KEYS_SUCCESS,
          failureType: ATS.GET_KEYS_FAILURE
        },
        url: '/keys',
        type: 'json',
        headers: {Bearer: token, 'Content-Type': 'application/vnd.api+json'},
        method: 'GET'
      }
    }));
  };

let fetchingKeys = false;
export const loadKeys = () =>
  (dispatch, getState) => {
    const keys = selectors.keys(getState().entities).toRefArray();
    if(keys.length > 0 || fetchingKeys) {
      return null;
    }
    else {
      fetchingKeys = true;
      return dispatch(fetchKeys());
    }
  };

const fetchBoardSounds = boardId =>
  (dispatch, getState) => {
    const token = getToken(getState());
    assert(token, 'Api token must be present. Have you authenticated?');
    return dispatch(createAction(ATS.GET_BOARD_SOUNDS_REQ)({
      [CALL_API]: {
        types: {
          successType: ATS.GET_BOARD_SOUNDS_SUCCESS,
          failureType: ATS.GET_BOARD_SOUNDS_FAILURE
        },
        url: `/boards/${boardId}/sounds`,
        type: 'json',
        headers: {Bearer: token, 'Content-Type': 'application/vnd.api+json'},
        method: 'GET'
      }
    }));
  };

let fetchingBoardSounds = false;
export const loadBoardSounds = boardId =>
  (dispatch, getState) => {
    const sounds = selectors.sounds(getState().entities).toRefArray();
    if(sounds.length > 0 || fetchingBoardSounds) {
      return null;
    }
    else {
      fetchingBoardSounds = true;
      return dispatch(fetchBoardSounds(boardId));
    }
  };

const fetchShortcutCommands = () =>
  (dispatch, getState) => {
    const token = getToken(getState());
    assert(token, 'Api token must be present. Have you authenticated?');
    return dispatch(createAction(ATS.GET_KEYS_REQ)({
      [CALL_API]: {
        types: {
          successType: ATS.GET_SHORTCUT_COMMANDS_SUCCESS,
          failureType: ATS.GET_SHORTCUT_COMMANDS_FAILURE
        },
        url: `/shortcut-commands`,
        type: 'json',
        headers: {Bearer: token, 'Content-Type': 'application/vnd.api+json'},
        method: 'GET'
      }
    }));
  };

let fetchingShortcutCommands = false;
export const loadShortcutCommands = () =>
  (dispatch, getState) => {
    const shortcutCommands = selectors.shortcutCommands(getState().entities)
      .toRefArray();
    if(shortcutCommands.length > 0 || fetchingShortcutCommands) {
      return null;
    }
    else {
      fetchingShortcutCommands = true;
      return dispatch(fetchShortcutCommands());
    }
  };
