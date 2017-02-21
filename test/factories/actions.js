import {ApiOptsFac} from './';
import {CALL_API} from 'app/middleware/api';
import {Factory} from 'rosie';

export const ActionFac = new Factory()
  .attr('type', 'FAKE');

export const ApiActionFac = new Factory()
  .extend(ActionFac)
  .attr('CALL_API')
  .attr('payload', ['CALL_API'], function(callApi) {
    return {[CALL_API]: ApiOptsFac.build(callApi)};
  });
