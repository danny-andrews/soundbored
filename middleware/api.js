import assert from 'arg-assert';
import 'fetch';
import i from 'icepick';

import adapter from 'app/util/adapter';

export const CALL_API = 'CALL_API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and resolves promise when such actions are dispatched.
export default function(spec = {}) {
  const {supportedSchemas} = spec;
  assert(
    Array.isArray(supportedSchemas) && supportedSchemas.length > 0,
    '"supportedSchemas" must be an array of length > 0'
  );

  return () => next => action => {
    const apiOptions = action[CALL_API];
    if(typeof apiOptions === 'undefined') {
      return next(action);
    }

    const {
      url,
      schema,
      types: {requestType, successType, failureType}
    } = apiOptions;

    assert(typeof url === 'string', 'Specify a string URL.');
    assert(
      supportedSchemas.some(supportedSchema => supportedSchema === schema),
      'Specify one of the exported Schemas.'
    );
    const types = [requestType, successType, failureType];
    assert(
      types.every(type => Boolean(type) && typeof type === 'string'),
      'Expected an object with "requestType," "successType," and "failure"' +
        'defined as strings.'
    );
    assert(
      types.every(type => typeof type === 'string'),
      'Expected action types to be strings.'
    );

    function actionWith(actionData) {
      const finalAction = Object.assign({}, action, actionData);
      delete finalAction[CALL_API];
      return finalAction;
    }

    next(actionWith({type: requestType}));

    const adapterOpts = i.merge({
      mode: apiOptions.crossOrigin ? 'cors' : 'same-origin'
    }, apiOptions);
    return adapter(adapterOpts)
      .then(response => next(actionWith({type: successType, response})))
      .catch(error => {
        const {response} = error;
        next(actionWith({
          type: failureType,
          error: response.data.message || 'Something bad happened',
          code: response.code
        }));
      }
    );
  };
}
