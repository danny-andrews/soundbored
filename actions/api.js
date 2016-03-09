import { createAction } from 'redux-actions';
import assert, { assertAll } from 'arg-assert';
import { createSelector } from 'reselect';
import { chain } from 'lodash';

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
      return undefined;
    }
    else {
      return dispatch(login(spec));
    }
  };

const fetchBoards = token =>
  createAction(ATS.GET_BOARDS_REQ)({
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
  });

export const loadBoards = () =>
  (dispatch, getState) => {
    const boards = getState().entities.Board;
    if(boards.isFetching || boards.haveBeenFetched) {
      return undefined;
    }
    else {
      const token = getToken(getState());
      assert(token, 'Api token must be present. Have you authenticated?');
      return dispatch(fetchBoards(token));
    }
  };

const fetchKeys = token =>
    createAction(ATS.GET_KEYS_REQ)({
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
    });

export const loadKeys = () =>
  (dispatch, getState) => {
    const keys = getState().entities.Key;
    if(keys.isFetching || keys.haveBeenFetched) {
      return undefined;
    }
    else {
      const token = getToken(getState());
      assert(token, 'Api token must be present. Have you authenticated?');
      return dispatch(fetchKeys(token));
    }
  };

const fetchBoardSounds = spec => {
  const {boardId, token} = spec;
  return createAction(ATS.GET_BOARD_SOUNDS_REQ)({
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
  });
};

export const loadBoardSounds = boardId =>
  (dispatch, getState) => {
    const sounds = getState().entities.Sound;
    if(sounds.isFetching || sounds.haveBeenFetched) {
      return undefined;
    }
    else {
      const token = getToken(getState());
      assert(token, 'Api token must be present. Have you authenticated?');
      return dispatch(fetchBoardSounds({boardId, token}));
    }
  };

const fetchShortcutCommands = token =>
  createAction(ATS.GET_SHORTCUT_COMMANDS_REQ)({
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
  });

export const loadShortcutCommands = () =>
  (dispatch, getState) => {
    const shortcutCommands = getState().entities.ShortcutCommand;
    if(shortcutCommands.isFetching || shortcutCommands.haveBeenFetched) {
      return undefined;
    }
    else {
      const token = getToken(getState());
      assert(token, 'Api token must be present. Have you authenticated?');
      return dispatch(fetchShortcutCommands(token));
    }
  };
