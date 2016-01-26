import expect from 'expect';
import stubber from 'fetch-mock';
import { has } from 'lodash';
import { Schema } from 'normalizr';

import middleware, { CALL_API } from 'app/middleware/api';
import { ab2str } from 'app/util/audio-helpers';
import { ApiActionFac } from 'test/factories';

const fakeSchema = new Schema('fakes');

function subject(spec = {}) {
  let {action} = spec;
  const {
    nextFunc: nextFunc = () => {},
    supportedSchemas: supportedSchemas = [fakeSchema]
  } = spec;
  const {payload: {[CALL_API]: apiOpts}} = action;
  if(apiOpts && (!has(apiOpts, 'schema') || apiOpts.schema)) {
    action.payload[CALL_API].schema = fakeSchema;
  }
  return middleware({supportedSchemas})()(nextFunc)(action);
}

describe('Middleware - api', function() {
  afterEach(function() {
    stubber.restore();
  });

  context(`${CALL_API} is not defined on action`, function() {
    beforeEach(function() {
      this.fakeAction = ApiActionFac.build();
      this.fakeAction.payload[CALL_API] = undefined;
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

  it('throws error when successType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {successType: undefined}
      }
    });
    expect(() => subject({action: fakeAction})).toThrow(/success/i);
  });

  it('throws error when failureType is undefined', function() {
    let fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {failureType: undefined}
      }
    });
    expect(() => subject({action: fakeAction})).toThrow(/failure/i);
  });

  it('calls next with action (excluding CALL_API)', function() {
    let fakeAction = ApiActionFac.build({
      type: 'REQ_TYPE',
      id: 1,
      [CALL_API]: {
        url: '/data/1',
        method: 'POST'
      }
    });
    stubber.mock(/data\/1/, 'POST', {body: {}});
    return new Promise(resolve =>
      subject({nextFunc: resolve, action: fakeAction})
    ).then(actual => {
      expect(actual.id).toEqual(1);
      expect(actual.type).toEqual('REQ_TYPE');
    });
  });

  context('api call succeeds', function() {
    beforeEach(function() {
      stubber.mock(/data\/1/, 'POST', {
        body: {id: 30, message: 'hi'}
      });
    });

    it('calls next with response from api call', function() {
      let fakeAction = ApiActionFac.build({
        [CALL_API]: {
          url: 'data/1',
          method: 'POST',
          body: {},
          types: {successType: 'SUCCESS'}
        }
      });
      let spy = expect.createSpy();
      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const action = spy.calls[1].arguments[0];
        const respData = action.response.data;
        expect(action.type).toBe('SUCCESS');
        expect(action.response.status).toBe(200);
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
        [CALL_API]: {
          url: 'data/1',
          types: {failureType: 'FAILURE'}
        }
      });
      let spy = expect.createSpy();
      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const action = spy.calls[1].arguments[0];
        expect(action.type).toBe('FAILURE');
        expect(action.error).toBe('you are not authorized');
        expect(action.response.status).toBe(401);
      });
    });
  });

  context('type = arrayBuffer', function() {
    beforeEach(function() {
      stubber.mock(/data\/1/, {body: 'I am binary data: 000111'});
    });

    it('calls next with response from api call', function() {
      let fakeAction = ApiActionFac.build({
        [CALL_API]: {
          url: 'data/1',
          type: 'arrayBuffer'
        }
      });
      let spy = expect.createSpy();
      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const action = spy.calls[1].arguments[0];
        const respData = action.response.data;
        const blob = respData.entities.fakes[undefined].blob;
        expect(blob).toExist();
        expect(ab2str(blob)).toBe('I am binary data: 000111');
      });
    });
  });
});
