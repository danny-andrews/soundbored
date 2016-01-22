import { camelizeKeys, decamelizeKeys } from 'humps';
import i from 'icepick';
import { normalize } from 'normalizr';

function checkStatus(response) {
  if(response.status >= 200 && response.status < 300) {
    return response;
  }
  else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export default function(spec) {
  const {url, schema, body, crossOrigin: crossOrigin = true} = spec;
  const request = new Request(url, i.assign({
    crossOrigin: true,
    type: 'json',
    contentType: 'application/json',
    mode: crossOrigin ? 'cors' : 'same-origin',
    body: JSON.stringify(decamelizeKeys(body))
  }, spec));

  return window.fetch(request)
    .then(checkStatus)
    .then(response =>
      response.json().then(json =>
        ({data: normalize(camelizeKeys(json), schema), code: 200})
      )
    ).catch(error => {
      const {response} = error;
      return response.json().then(json => {
        const error = new Error(json);
        error.response = {data: camelizeKeys(json), code: response.status};
        throw error;
      });
    });
}
