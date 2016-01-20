import assert from 'arg-assert';
import reqwest from 'reqwest';
import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { API_VERSION, SINGLETON_ID } from 'app/constants';

export function callApi(spec) {
  let {data: data = null} = spec;
  const {
    schema,
    host,
    endpoint,
    headers,
    method: method = 'GET',
    crossOrigin: crossOrigin = true,
    type: type = 'json',
    contentType: contentType = 'application/json'
  } = spec;
  data = JSON.stringify(decamelizeKeys(data));
  const parts = [API_VERSION, endpoint];
  if(Boolean(host)) {
    parts.unshift(`http://${host}`);
  }
  const url = parts.join('/');

  return new Promise((resolve, reject) => {
    reqwest({url, method, crossOrigin, type, contentType, headers})
      .then(response => {
        const camelizedResponse = camelizeKeys(response);
        resolve({
          data: normalize(camelizedResponse, schema),
          code: 200
        });
      }).fail(response => {
        reject({
          data: camelizeKeys(JSON.parse(response.responseText)),
          code: response.status
        });
      });
  });
}

const sessionSchema = new Schema('sessions', {idAttribute: () => SINGLETON_ID});
const configSchema = new Schema('configs', {idAttribute: () => SINGLETON_ID});
const customerSchema = new Schema('customers');
const purchaseSchema = new Schema('purchases');
const cardSchema = new Schema('cards');
const planSchema = new Schema('plans');
const itemSchema = new Schema('items');
const subscriptionSchema = new Schema('subscriptions');
const metricSchema = new Schema('metrics');

purchaseSchema.define({owner: customerSchema});

export const SCHEMAS = Object.freeze({
  CUSTOMER: customerSchema,
  CONFIG: configSchema,
  PURCHASE: purchaseSchema,
  CARD: cardSchema,
  CARD_ARRAY: arrayOf(cardSchema),
  PLAN: planSchema,
  PLAN_ARRAY: arrayOf(planSchema),
  ITEM: itemSchema,
  ITEM_ARRAY: arrayOf(itemSchema),
  SUBSCRIPTION: subscriptionSchema,
  SUBSCRIPTION_ARRAY: arrayOf(subscriptionSchema),
  SESSION: sessionSchema,
  METRIC: metricSchema
});

export const CALL_API = 'CALL_API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and resolves promise when such actions are dispatched.
export default store => next => action => {
  const apiOptions = action[CALL_API];
  if(typeof apiOptions === 'undefined') {
    return next(action);
  }

  let {endpoint} = apiOptions;
  const {
    schema,
    host,
    method,
    data,
    headers,
    crossOrigin,
    types: {requestType, successType, failureType}
  } = apiOptions;

  if(typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }
  assert(typeof endpoint === 'string', 'Specify a string endpoint URL.');
  assert(Boolean(schema), 'Specify one of the exported Schemas.');
  const types = [requestType, successType, failureType];
  assert(
    types.every(type => Boolean(type)),
    `Expected an object with "requestType," "successType," and "failure" keys \`
      defined.`
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

  return callApi({
      schema,
      endpoint,
      host,
      method,
      data,
      headers,
      crossOrigin
    }).then(
    response => next(actionWith({
      type: successType,
      response
    }))
  ).catch(
    error => {
      next(actionWith({
        type: failureType,
        error: error.data.message || 'Something bad happened',
        code: error.code
      }));
    }
  );
};
