import expect from 'expect';

import { entityMapToOrmData } from 'app/reducers/entities';
import { CALL_API } from 'app/middleware/api';
import { authenticate } from 'app/actions';
import * as ATS from 'app/constants/action-types';
import { SessionFac } from 'test/factories';

const stateFac = entityData => ({entities: entityMapToOrmData(entityData)});

describe('Actions - api', () => {
  describe('#authenticate', function() {
    it('dispatches "login" action if session is not in store', () => {
      const fakeDispatch = f => f;
      const getState = () => stateFac({Session: []});
      const dispatchedAction = authenticate({
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

    it('returns undefined if session is already in store', () => {
      const fakeDispatch = f => f;
      const getState = () => stateFac({Session: [SessionFac.build()]});
      const dispatchedAction = authenticate({
        auid: 'dlks',
        name: 'Bob'
      })(fakeDispatch, getState);
      expect(dispatchedAction).toBe(undefined);
    });
  });
});
