import expect from 'expect';

import { CALL_API } from 'app/middleware/api';
import { authenticate } from 'app/actions';
import * as ATS from 'app/constants/action-types';

describe('Actions - api', () => {
  describe('#authenticate', function() {
    it('returns properly-formed action', () => {
      const {
        type, payload: {[CALL_API]: configOpts}
      } = authenticate({auid: 'dlks', name: 'Bob'});
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
});
