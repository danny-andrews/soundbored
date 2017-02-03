import middleware, {CALL_API} from 'app/middleware/api';
import {ab2str} from 'app/util/audio-helpers';
import {ApiActionFac} from 'test/factories';
import expect from 'expect';
import stubber from 'fetch-mock';

function subject(spec = {}) {
  const {action, nextFunc: nextFunc = () => {}} = spec;

  return middleware()(nextFunc)(action);
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
      const spy = expect.createSpy();
      subject({nextFunc: spy, action: this.fakeAction});
      expect(spy.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith(this.fakeAction);
    });

    it('returns result of calling next with given action', function() {
      const actual = subject({nextFunc: () => 4, action: this.fakeAction});
      expect(actual).toBe(4);
    });
  });

  it('throws error when url is not a string', function() {
    const fakeAction = ApiActionFac.build({
      [CALL_API]: {url: 3}
    });
    expect(() => subject({action: fakeAction})).toThrow(/url/i);
  });

  it('throws error when successType is undefined', function() {
    const fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {successType: undefined}
      }
    });
    expect(() => subject({action: fakeAction})).toThrow(/success/i);
  });

  it('throws error when failureType is undefined', function() {
    const fakeAction = ApiActionFac.build({
      [CALL_API]: {
        types: {failureType: undefined}
      }
    });
    expect(() => subject({action: fakeAction})).toThrow(/failure/i);
  });

  it('calls next with action (excluding CALL_API)', function() {
    const fakeAction = ApiActionFac.build({
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
      const fakeAction = ApiActionFac.build({
        [CALL_API]: {
          url: 'data/1',
          method: 'POST',
          body: {},
          types: {successType: 'SUCCESS'}
        }
      });
      const spy = expect.createSpy();

      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const [action] = spy.calls[1].arguments;
        const respData = action.response.data;
        expect(action.type).toBe('SUCCESS');
        expect(action.response.status).toBe(200);
        expect(respData).toEqual({id: 30, message: 'hi'});
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
      const fakeAction = ApiActionFac.build({
        [CALL_API]: {
          url: 'data/1',
          types: {failureType: 'FAILURE'}
        }
      });
      const spy = expect.createSpy();

      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const [action] = spy.calls[1].arguments;
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
      const fakeAction = ApiActionFac.build({
        [CALL_API]: {
          url: 'data/1',
          type: 'arrayBuffer'
        }
      });
      const spy = expect.createSpy();

      return subject({nextFunc: spy, action: fakeAction}).then(() => {
        const [action] = spy.calls[1].arguments;
        const respData = action.response.data;
        const {blob} = respData;
        expect(blob).toExist();
        expect(ab2str(blob)).toBe('I am binary data: 000111');
      });
    });
  });
});
