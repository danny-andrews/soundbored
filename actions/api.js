import { createAction } from 'redux-actions';
import assert, { assertAll } from 'arg-assert';
import { createSelector } from 'reselect';

import { CALL_API } from 'app/middleware/api';
import * as ATS from 'app/constants/action-types';

const getToken = createSelector(
  state => state.entities.Session.itemsById['1'],
  session => session && session.token
);

export const authenticate = createAction(ATS.AUTHENTICATE_REQ, spec => {
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

export const getBoards = () =>
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

export const getKeys = () =>
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

export const getBoardSounds = boardId =>
  (dispatch, getState) => {
    const token = getToken(getState());
    assert(token, 'Api token must be present. Have you authenticated?');
    return dispatch(createAction(ATS.GET_KEYS_REQ)({
      [CALL_API]: {
        types: {
          successType: ATS.GET_BOARDS_SUCCESS,
          failureType: ATS.GET_BOARDS_FAILURE
        },
        url: `/boards/${boardId}/sounds`,
        type: 'json',
        headers: {Bearer: token, 'Content-Type': 'application/vnd.api+json'},
        method: 'GET'
      }
    }));
  };

export const getShortcutCommands = () =>
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
