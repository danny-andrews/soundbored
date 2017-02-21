import 'fetch';
import assert from 'arg-assert';
import {camelizeKeys} from 'humps';
import {error} from 'app/util/logger';
import i from 'icepick';
import SerializerFactory from 'app/util/serializers';

export const CALL_API = 'CALL_API';

const SUPPORTED_RESPONSE_TYPES = ['json', 'arrayBuffer'];

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and resolves promise when such actions are dispatched.
export default () => next => action => {
  const apiOptions = action.payload && action.payload[CALL_API];
  if(apiOptions === undefined) {
    return next(action);
  }

  const {url, type, types: {successType, failureType}} = apiOptions;

  assert(typeof url === 'string', 'Specify a string URL.');
  assert(
    [successType, failureType]
      .every(reqType => Boolean(reqType) && typeof reqType === 'string'),
    'Expected an object with "successType," and "failureType" '
      + 'defined as strings.'
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

  const serializer = SerializerFactory(type, apiOptions.body);
  const adapterOpts = i.assign(apiOptions, {
    mode: apiOptions.crossOrigin ? 'cors' : 'same-origin',
    body: serializer.serialize()
  });

  return window.fetch(url, adapterOpts)
    .then(response =>
      response[type]().then(respData => {
        if(response.ok) {
          nextWithAction({
            type: successType,
            response: {
              data: SerializerFactory(type, respData).deserialize(),
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
    ).catch(err => error(err.stack));
};
