import expect from 'expect';

import api, { CALL_API } from 'app/middleware/api';
import { ApiActionFac } from 'test/factories';
import ServerStubber from 'test/support/server-stubber';

const fakeStore = {getState() {}};

describe('Middleware - api', function() {
  beforeEach(function() {
    this.stubber = ServerStubber();
  });
  afterEach(function() {
    this.stubber.destroy();
  });

  context(`${CALL_API} is not defined on action`, function() {
    beforeEach(function() {
      this.fakeAction = ApiActionFac.build();
      this.fakeAction[CALL_API] = undefined;
    });

    it('calls next with given action', function() {
      let spy = expect.createSpy();
      api(fakeStore)(spy)(this.fakeAction);
      expect(spy.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(this.fakeAction);
    });

    it('returns result of calling next with given action', function() {
      let actual = api(fakeStore)(() => 4)(this.fakeAction);
      expect(actual).toBe(4);
    });
  });

  it('throws error when schema is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {schema: undefined}
    });
    expect(() => api(fakeStore)(() => {})(fakeAction)).toThrow(/schemas/i);
  });

  it('throws error when endpoint is not a string', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {endpoint: 3}
    });
    expect(() => api(fakeStore)(() => {})(fakeAction)).toThrow(/endpoint/i);
  });

  it('throws error when requestType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {types: {requestType: undefined}}
    });
    expect(() => api(fakeStore)(() => {})(fakeAction)).toThrow(/request/i);
  });

  it('throws error when successType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {successType: undefined}
      }
    });
    expect(() => api(fakeStore)(() => {})(fakeAction)).toThrow(/request/i);
  });

  it('throws error when failureType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {failureType: undefined}
      }
    });
    expect(() => api(fakeStore)(() => {})(fakeAction)).toThrow(/request/i);
  });

  it('calls next with action (excluding CALL_API)', function() {
    let fakeAction = ApiActionFac.build({
      id: 1,
      [CALL_API]: {
        endpoint: 'data/2',
        method: 'POST',
        types: {requestType: 'REQ_TYPE'}
      }
    });
    this.stubber.stubRequest('data/2', {method: 'POST'});
    return new Promise(
      resolve => api(fakeStore)(resolve)(fakeAction))
        .then(actual => expect(actual).toEqual({type: 'REQ_TYPE', id: 1}));
  });

  context('api call succeeds', function() {
    beforeEach(function() {
      this.stubber.stubRequest('data/1', {
        method: 'POST',
        code: 200,
        data: {id: 30, message: 'hi'}
      });
    });

    it('calls next with response from api call', function() {
      let fakeAction = ApiActionFac.build({
        id: 1,
        [CALL_API]: {
          endpoint: 'data/1',
          method: 'POST',
          types: {successType: 'SUCCESS'}
        }
      });
      let spy = expect.createSpy();
      return api(fakeStore)(spy)(fakeAction).then(() => {
        const action = spy.calls[1].arguments[0];
        const respData = action.response.data;
        expect(action.type).toBe('SUCCESS');
        expect(action.id).toBe(1);
        expect(action.response.code).toBe(200);
        expect(respData.result).toBe(30);
        expect(respData.entities.fakes[30]).toEqual({id: 30, message: 'hi'});
      });
    });
  });

  context('api call fails', function() {
    beforeEach(function() {
      this.stubber.stubRequest('data/1', {
        method: 'GET',
        code: 401,
        data: {message: 'you are not authorized'}
      });
    });

    it('calls next with response from api call', function() {
      let fakeAction = ApiActionFac.build({
        id: 1,
        [CALL_API]: {
          endpoint: 'data/1',
          method: 'GET',
          types: {failureType: 'FAILURE'}
        }
      });
      let spy = expect.createSpy();
      return api(fakeStore)(spy)(fakeAction).then(() => {
        const action = spy.calls[1].arguments[0];
        expect(action.type).toBe('FAILURE');
        expect(action.id).toBe(1);
        expect(action.error).toBe('you are not authorized');
        expect(action.code).toBe(401);
      });
    });
  });
});
