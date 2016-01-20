import Pretender from 'pretender';
import { camelizeKeys, decamelizeKeys } from 'humps';

import { API_VERSION } from 'app/constants';

function buildUrl(host, url) {
  const parts = [];
  if(Boolean(host)) {
    parts.push(`http://${host}`);
  }
  parts.push(`${API_VERSION}`);
  const urlIsRegExp = url instanceof RegExp;
  parts.push(urlIsRegExp ? url.source : url);
  return urlIsRegExp ? new RegExp(url) : parts.join('/');
}

export default function(spec = {}) {
  let {host} = spec;
  let server;

  function stubRequest(url, opts = {}) {
    opts = Object.assign({
      method: 'GET',
      code: 200,
      data: {},
      headers: {},
      host,
      appendApiPrefix: true,
      respondImmediately: true
    }, opts);
    if(opts.appendApiPrefix) {
      url = buildUrl(opts.host, url);
    }

    return new Promise(resolve => {
      server[opts.method.toLowerCase()](url, request => {
        let body = camelizeKeys(JSON.parse(request.requestBody));
        resolve({body, headers: request.requestHeaders});
        return [opts.code, opts.headers, opts.data];
      });
    });
  }

  function destroy() {
    server.shutdown();
  }

  function setupServer() {
    server = new Pretender();
    server.unhandledRequest = function(verb, path) {
      throw new Error(`Unhandled request: (verb: ${verb} path: ${path})`);
    };
    server.prepareBody = body => JSON.stringify(decamelizeKeys(body));
    server.prepareHeaders = headers => {
      headers['content-type'] = 'application/json';
      return headers;
    };
    server.erroredRequest = function(verb, path, request, error) {
      throw new Error(error);
    };
  }

  setupServer();

  return Object.freeze({
    stubRequest,
    destroy
  });
}
