import { Factory } from 'rosie';
import { Schema } from 'normalizr';

export const ApiTypesFac = new Factory()
  .attr('requestType', 'DO_REQ')
  .attr('successType', 'REQ_SUCCESS')
  .attr('failureType', 'REQ_FALURE');

export const ApiOptsFac = new Factory()
  .attr('schema', new Schema('fakes'))
  .attr('url', '/fake/api')
  .attr('crossOrigin', false)
  .attr('types', ['types'], function(types) {
    return ApiTypesFac.build(types);
  });
