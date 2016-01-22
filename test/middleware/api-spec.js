import expect from 'expect';
import stubber from 'fetch-mock';
import { has } from 'lodash';
import { Schema } from 'normalizr';

import middleware, { CALL_API } from 'app/middleware/api';
import { ApiActionFac } from 'test/factories';

const fakeSchema = new Schema('fakes');

function subject(spec = {}) {
  let {action} = spec;
  const {
    nextFunc: nextFunc = () => {},
    supportedSchemas: supportedSchemas = [fakeSchema]
  } = spec;
  const apiOpts = action[CALL_API];
  if(apiOpts && (!has(apiOpts, 'schema') || apiOpts.schema)) {
    action[CALL_API].schema = fakeSchema;
  }
  return middleware({supportedSchemas})()(nextFunc)(action);
}

describe('Middleware - api', function() {
  afterEach(function() {
    stubber.reset();
  });

  context(`${CALL_API} is not defined on action`, function() {
    beforeEach(function() {
      this.fakeAction = ApiActionFac.build();
      this.fakeAction[CALL_API] = undefined;
    });

    it('calls next with given action', function() {
      let spy = expect.createSpy();
      subject({nextFunc: spy, action: this.fakeAction});
      expect(spy.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(this.fakeAction);
    });

    it('returns result of calling next with given action', function() {
      let actual = subject({nextFunc: () => 4, action: this.fakeAction});
      expect(actual).toBe(4);
    });
  });

  it('throws error when schema is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {schema: undefined}
    });
    expect(() => subject({action: fakeAction})).toThrow(/schemas/i);
  });

  it('throws error when url is not a string', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {url: 3}
    });
    expect(() => subject({action: fakeAction})).toThrow(/url/i);
  });

  it('throws error when requestType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {types: {requestType: undefined}}
    });
    expect(() => subject({action: fakeAction})).toThrow(/request/i);
  });

  it('throws error when successType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {successType: undefined}
      }
    });
    expect(() => subject({action: fakeAction})).toThrow(/request/i);
  });

  it('throws error when failureType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {failureType: undefined}
      }
    });
    expect(() => subject({action: fakeAction})).toThrow(/request/i);
  });

  it('calls next with action (excluding CALL_API)', function() {
    let fakeAction = ApiActionFac.build({
      id: 1,
      [CALL_API]: {
        url: '/data/2',
        method: 'POST',
        types: {requestType: 'REQ_TYPE'}
      }
    });
    stubber.mock(/data\/2/, 'POST', {body: {}});
    return new Promise(
      resolve => subject({nextFunc: resolve, action: fakeAction})
        .then(actual => expect(actual).toEqual({type: 'REQ_TYPE', id: 1}))
    );
  });

  context('api call succeeds', function() {
    beforeEach(function() {
      stubber.mock(/data\/1/, 'POST', {
        body: {id: 30, message: 'hi'}
      });
    });

    it('calls next with response from api call', function() {
      let fakeAction = ApiActionFac.build({
        id: 1,
        [CALL_API]: {
          url: 'data/1',
          method: 'POST',
          types: {successType: 'SUCCESS'}
        }
      });
      let spy = expect.createSpy();
      return subject({nextFunc: spy, action: fakeAction}).then(() => {
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
      stubber.mock(/data\/1/, {
        status: 401,
        body: {message: 'you are not authorized'}
      });
    });

    it('calls next with response from api call', function() {
      let fakeAction = ApiActionFac.build({
        id: 1,
        [CALL_API]: {
          url: 'data/1',
          method: 'GET',
          types: {failureType: 'FAILURE'}
        }
      });
      let spy = expect.createSpy();
      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const action = spy.calls[1].arguments[0];
        expect(action.type).toBe('FAILURE');
        expect(action.id).toBe(1);
        expect(action.error).toBe('you are not authorized');
        expect(action.code).toBe(401);
      });
    });
  });
});
