import { normalize } from 'normalizr';
import { camelizeKeys, decamelizeKeys } from 'humps';

const identity = () => arg => arg;

function NullSerializer() {
  return Object.freeze({serialize: identity, deserialize: identity});
}

function ArrayBufferSerializer(options = {}) {
  const {schema} = options;
  function serialize(data) {
    return decamelizeKeys(data);
  }
  function deserialize(data) {
    return normalize({blob: data}, schema);
  }

  return Object.freeze({serialize, deserialize});
}

function JSONSerializer(options = {}) {
  const {schema} = options;
  function serialize(data) {
    return JSON.stringify(decamelizeKeys(data));
  }
  function deserialize(data) {
    return normalize(camelizeKeys(data), schema);
  }

  return Object.freeze({serialize, deserialize});
}

export default function(responseType, options) {
  switch(responseType) {
  case 'json':
    return JSONSerializer(options);
  case 'arrayBuffer':
    return ArrayBufferSerializer(options);
  default:
    return NullSerializer(options);
  }
}
