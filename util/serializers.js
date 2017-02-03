import {camelizeKeys, decamelizeKeys} from 'humps';

const identity = () => arg => arg;

export function NullSerializer() {
  return Object.freeze({serialize: identity, deserialize: identity});
}

export function ArrayBufferSerializer(data) {
  function serialize() {
    return decamelizeKeys(data);
  }
  function deserialize() {
    return {blob: data};
  }

  return Object.freeze({serialize, deserialize});
}

export function JSONSerializer(data) {
  function serialize() {
    return JSON.stringify(decamelizeKeys(data));
  }
  function deserialize() {
    let retVal = data;
    if(typeof data === 'string') {
      retVal = JSON.parse(data);
    }

    return camelizeKeys(retVal);
  }

  return Object.freeze({serialize, deserialize});
}

export default function(responseType, data) {
  switch(responseType) {
  case 'json':
    return JSONSerializer(data);
  case 'arrayBuffer':
    return ArrayBufferSerializer(data);
  default:
    return NullSerializer(data);
  }
}
