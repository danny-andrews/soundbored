import assert from 'arg-assert';
import 'fetch';
import i from 'icepick';
import { camelizeKeys } from 'humps';

import SerializerFactory from 'app/util/serializers';
import { error } from 'app/util/logger';

export const CALL_API = 'CALL_API';

const SUPPORTED_RESPONSE_TYPES = ['json', 'arrayBuffer'];

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and resolves promise when such actions are dispatched.
export default function(spec = {}) {
  const {supportedSchemas} = spec;
  assert(
    Array.isArray(supportedSchemas) && supportedSchemas.length > 0,
    '"supportedSchemas" must be an array of length > 0'
  );

  return () => next => action => {
    const {payload: {[CALL_API]: apiOptions}} = action;
    if(typeof apiOptions === 'undefined') {
      return next(action);
    }

    const {url, schema, type, types: {successType, failureType}} = apiOptions;

    assert(typeof url === 'string', 'Specify a string URL.');
    assert(
      supportedSchemas.some(supportedSchema => supportedSchema === schema),
      'Specify one of the exported Schemas.'
    );
    assert(
      [successType, failureType]
        .every(type => Boolean(type) && typeof type === 'string'),
      'Expected an object with "successType," and "failureType" ' +
        'defined as strings.'
    );
    assert(
      SUPPORTED_RESPONSE_TYPES.indexOf(type) > -1,
      `Unsupported response type: ${type}`
    );

    function nextWithAction(actionData) {
      const finalAction = i.assign(action, actionData);
      return next(i.unset(finalAction, CALL_API));
    }

    nextWithAction({type: action.type});

    const serializer = SerializerFactory(type, {schema});
    const adapterOpts = i.assign(apiOptions, {
      mode: apiOptions.crossOrigin ? 'cors' : 'same-origin',
      body: serializer.serialize(apiOptions.body)
    });
    return window.fetch(url, adapterOpts)
      .then(response =>
        response[type]().then(respData => {
          if(response.ok) {
            nextWithAction({
              type: successType,
              response: {
                data: serializer.deserialize(respData),
                status: response.status
              }
            });
          }
          else {
            const data = camelizeKeys(respData);
            nextWithAction({
              type: failureType,
              error: data.message,
              response: {data, status: response.status}
            });
          }
        })
      ).catch(err => error(`Error making request ${err}`));
  };
}
