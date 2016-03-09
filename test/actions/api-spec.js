import expect from 'expect';
import i from 'icepick';

import { entityMapToOrmData } from 'app/reducers/entities';
import { CALL_API } from 'app/middleware/api';
import * as actions from 'app/actions';
import * as ATS from 'app/constants/action-types';
import * as facs from 'test/factories';

const stateFac = entityData => ({entities: entityMapToOrmData(entityData)});
const fakeDispatch = f => f;

describe('Actions - api', () => {
  describe('#authenticate', function() {
    context('session is already in store', function() {
      it('returns undefined if session is already in store', () => {
        const getState = () => stateFac({Session: [facs.SessionFac.build()]});
        const dispatchedAction = actions.authenticate({
          auid: 'dlks',
          name: 'Bob'
        })(fakeDispatch, getState);
        expect(dispatchedAction).toBe(undefined);
      });
    });

    it('dispatches "login" action', () => {
      const getState = () => stateFac({Session: []});
      const dispatchedAction = actions.authenticate({
        auid: 'dlks',
        name: 'Bob'
      })(fakeDispatch, getState);
      const {
        type,
        payload: {[CALL_API]: configOpts}
      } = dispatchedAction;
      expect(type).toEqual(ATS.AUTHENTICATE_REQ);
      expect(configOpts.types).toEqual({
        successType: ATS.AUTHENTICATE_SUCCESS,
        failureType: ATS.AUTHENTICATE_FAILURE
      });
      expect(configOpts.url).toBe('/login');
      expect(configOpts.type).toBe('json');
      expect(configOpts.method).toBe('POST');
      expect(configOpts.body).toEqual({auid: 'dlks', name: 'Bob'});
    });
  });

  describe('#loadBoards', function() {
    context('session has not been established', function() {
      it('throws error', function() {
        const getState = () => stateFac({Session: [], Board: []});
        expect(() => actions.loadBoards()(fakeDispatch, getState))
          .toThrow(/token/);
      });
    });

    context('boards have been fetched', function() {
      it('returns undefined', () => {
        let state = stateFac({
          Session: [facs.SessionFac.build()],
          Board: [facs.BoardFac.build()]
        });
        state = i.setIn(state, ['entities', 'Board', 'haveBeenFetched'], true);
        const getState = () => state;
        const dispatchedAction = actions.loadBoards()(fakeDispatch, getState);
        expect(dispatchedAction).toBe(undefined);
      });
    });

    it('dispatches "getBoards" action', () => {
      const getState = () => stateFac({
        Session: [facs.SessionFac.build({token: 'dhsie22fds'})],
        Board: []
      });
      const dispatchedAction = actions.loadBoards()(fakeDispatch, getState);
      const {
        type,
        payload: {[CALL_API]: configOpts}
      } = dispatchedAction;
      expect(type).toEqual(ATS.GET_BOARDS_REQ);
      expect(configOpts.types).toEqual({
        successType: ATS.GET_BOARDS_SUCCESS,
        failureType: ATS.GET_BOARDS_FAILURE
      });
      expect(configOpts.url).toBe('/boards');
      expect(configOpts.type).toBe('json');
      expect(configOpts.method).toBe('GET');
      expect(configOpts.headers).toEqual({
        'Content-Type': 'application/vnd.api+json',
        Bearer: 'dhsie22fds'
      });
    });
  });

  describe('#loadKeys', function() {
    context('session has not been established', function() {
      it('throws error', function() {
        const getState = () => stateFac({Session: [], Key: []});
        expect(() => actions.loadKeys()(fakeDispatch, getState))
          .toThrow(/token/);
      });
    });

    context('keys have been fetched', function() {
      it('returns undefined', () => {
        let state = stateFac({
          Session: [facs.SessionFac.build()],
          Key: [facs.KeyFac.build()]
        });
        state = i.setIn(state, ['entities', 'Key', 'haveBeenFetched'], true);
        const getState = () => state;
        const dispatchedAction = actions.loadKeys()(fakeDispatch, getState);
        expect(dispatchedAction).toBe(undefined);
      });
    });

    it('dispatches "getKeys" action', () => {
      const getState = () => stateFac({
        Session: [facs.SessionFac.build({token: 'dhsie22fds'})],
        Key: []
      });
      const dispatchedAction = actions.loadKeys()(fakeDispatch, getState);
      const {
        type,
        payload: {[CALL_API]: configOpts}
      } = dispatchedAction;
      expect(type).toEqual(ATS.GET_KEYS_REQ);
      expect(configOpts.types).toEqual({
        successType: ATS.GET_KEYS_SUCCESS,
        failureType: ATS.GET_KEYS_FAILURE
      });
      expect(configOpts.url).toBe('/keys');
      expect(configOpts.type).toBe('json');
      expect(configOpts.method).toBe('GET');
      expect(configOpts.headers).toEqual({
        'Content-Type': 'application/vnd.api+json',
        Bearer: 'dhsie22fds'
      });
    });
  });

  describe('#loadShortcutCommands', function() {
    context('session has not been established', function() {
      it('throws error', function() {
        const getState = () => stateFac({Session: [], ShortcutCommand: []});
        expect(() => actions.loadShortcutCommands()(fakeDispatch, getState))
          .toThrow(/token/);
      });
    });

    context('shortcutCommands have been fetched', function() {
      it('returns undefined', () => {
        let state = stateFac({
          Session: [facs.SessionFac.build()],
          ShortcutCommand: [facs.ShortcutCommandFac.build()]
        });
        state = i.setIn(
          state,
          ['entities', 'ShortcutCommand', 'haveBeenFetched'],
          true
        );
        const getState = () => state;
        const dispatchedAction = actions.loadShortcutCommands()(
          fakeDispatch,
          getState
        );
        expect(dispatchedAction).toBe(undefined);
      });
    });

    it('dispatches "getShortcutCommands" action', () => {
      const getState = () => stateFac({
        Session: [facs.SessionFac.build({token: 'dhsie22fds'})],
        ShortcutCommand: []
      });
      const dispatchedAction = actions.loadShortcutCommands()(
        fakeDispatch,
        getState
      );
      const {
        type,
        payload: {[CALL_API]: configOpts}
      } = dispatchedAction;
      expect(type).toEqual(ATS.GET_SHORTCUT_COMMANDS_REQ);
      expect(configOpts.types).toEqual({
        successType: ATS.GET_SHORTCUT_COMMANDS_SUCCESS,
        failureType: ATS.GET_SHORTCUT_COMMANDS_FAILURE
      });
      expect(configOpts.url).toBe('/shortcut-commands');
      expect(configOpts.type).toBe('json');
      expect(configOpts.method).toBe('GET');
      expect(configOpts.headers).toEqual({
        'Content-Type': 'application/vnd.api+json',
        Bearer: 'dhsie22fds'
      });
    });
  });

  describe('#loadBoardSounds', function() {
    context('session has not been established', function() {
      it('throws error', function() {
        const getState = () => stateFac({Session: [], Sound: []});
        expect(() => actions.loadBoardSounds()(fakeDispatch, getState))
          .toThrow(/token/);
      });
    });

    context('sounds have been fetched', function() {
      it('returns undefined', () => {
        let state = stateFac({
          Session: [facs.SessionFac.build()],
          Sound: [facs.SoundFac.build()]
        });
        state = i.setIn(state, ['entities', 'Sound', 'haveBeenFetched'], true);
        const getState = () => state;
        const dispatchedAction = actions.loadBoardSounds()(
          fakeDispatch,
          getState
        );
        expect(dispatchedAction).toBe(undefined);
      });
    });

    it('dispatches "getBoardSounds" action', () => {
      const getState = () => stateFac({
        Session: [facs.SessionFac.build({token: 'dhsie22fds'})],
        Sound: []
      });
      const dispatchedAction = actions.loadBoardSounds(3)(
        fakeDispatch,
        getState
      );
      const {
        type,
        payload: {[CALL_API]: configOpts}
      } = dispatchedAction;
      expect(type).toEqual(ATS.GET_BOARD_SOUNDS_REQ);
      expect(configOpts.types).toEqual({
        successType: ATS.GET_BOARD_SOUNDS_SUCCESS,
        failureType: ATS.GET_BOARD_SOUNDS_FAILURE
      });
      expect(configOpts.url).toBe('/boards/3/sounds');
      expect(configOpts.type).toBe('json');
      expect(configOpts.method).toBe('GET');
      expect(configOpts.headers).toEqual({
        'Content-Type': 'application/vnd.api+json',
        Bearer: 'dhsie22fds'
      });
    });
  });
});
